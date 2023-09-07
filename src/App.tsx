import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthenticationGuard } from "./components/guards/AuthenticationGuard";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";

import { reaction } from "mobx";
import Loader from "./components/Loader";
import { UnauthenticatedGuard } from "./components/guards/UnauthenticatedGuard";
import useLogger from "./hooks/useLogger";
import AppPage from "./pages/AppPage";
import LogoutPage from "./pages/LogoutPage";
import ChannelPage from "./pages/subpages/ChannelPage";
import { useAppStore } from "./stores/AppStore";
import { Globals } from "./utils/Globals";

function App() {
	const app = useAppStore();
	const logger = useLogger("App");
	const navigate = useNavigate();

	React.useEffect(() => {
		// Handles gateway connection/disconnection on token change
		const dispose = reaction(
			() => app.token,
			(value) => {
				if (value) {
					app.rest.setToken(value);
					if (app.gateway.readyState === WebSocket.CLOSED) {
						app.setGatewayReady(false);
						app.gateway.connect(Globals.routeSettings.gateway);
					} else {
						logger.debug("Gateway connect called but socket is not closed");
					}
				} else {
					logger.debug("user no longer authenticated");
					if (app.gateway.readyState === WebSocket.OPEN) {
						app.gateway.disconnect(1000, "user is no longer authenticated");
					}

					navigate("/");
				}
			},
		);

		Globals.load();
		app.loadToken();

		logger.debug("Loading complete");
		app.setAppLoading(false);

		return dispose;
	}, []);

	return (
		<Loader>
			<Routes>
				<Route index path="/" element={<AuthenticationGuard component={AppPage} />} />
				<Route path="/app" element={<AuthenticationGuard component={AppPage} />} />
				<Route
					path="/channels/:guildId/:channelId?"
					element={<AuthenticationGuard component={ChannelPage} />}
				/>
				<Route path="/login" element={<UnauthenticatedGuard component={LoginPage} />} />
				<Route path="/register" element={<UnauthenticatedGuard component={RegistrationPage} />} />
				<Route path="/logout" element={<AuthenticationGuard component={LogoutPage} />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Loader>
	);
}

export default observer(App);
