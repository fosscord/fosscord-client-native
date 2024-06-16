import styled from "styled-components";
import { modalController } from "../controllers/modals";
import { useAppStore } from "../stores/AppStore";
import User from "../stores/objects/User";
import Avatar from "./Avatar";
import Icon from "./Icon";
import IconButton from "./IconButton";
import Floating from "./floating/Floating";
import FloatingTrigger from "./floating/FloatingTrigger";

const Section = styled.section`
	flex: 0 0 auto;
	background-color: var(--background-secondary-alt);
`;

const Container = styled.div`
	display: flex;
	height: 52px;
	align-items: center;
	padding: 0 8px;
	margin-bottom: 1px;
	background-color: var(--background-secondary-alt);
`;

const AvatarWrapper = styled(FloatingTrigger)`
	display: flex;
	align-items: center;
	min-width: 120px;
	padding-left: 2px;
	margin-right: 8px;
	border-radius: 4px;
	cursor: default;

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Name = styled.div`
	padding: 4px 0 4px 8px;
	margin-right: 4px;
`;

const Username = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-medium);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	cursor: pointer;
`;

const Subtext = styled.div`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	user-select: none;
`;

const ActionsWrapper = styled.div`
	flex: 1;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-end;
	align-items: stretch;
	display: flex;
`;

function UserPanel() {
	const app = useAppStore();
	const presence = app.presences.get(app.account!.id);

	const openSettingsModal = () => {
		modalController.push({
			type: "settings",
		});
	};

	return (
		<Floating
			placement="bottom"
			type="userPopout"
			props={{
				user: app.account! as unknown as User,
			}}
		>
			<Section>
				<Container>
					<AvatarWrapper>
						<Avatar popoutPlacement="top" onClick={null} showPresence presence={presence} />
						<Name>
							<Username>{app.account?.username}</Username>
							<Subtext>#{app.account?.discriminator}</Subtext>
						</Name>
					</AvatarWrapper>

					<ActionsWrapper>
						<Floating
							placement="top"
							type="tooltip"
							offset={10}
							props={{
								content: <span>Settings</span>,
							}}
						>
							<FloatingTrigger>
								<IconButton aria-label="settings" color="#fff" onClick={openSettingsModal}>
									<Icon icon="mdiCog" size="20px" />
								</IconButton>
							</FloatingTrigger>
						</Floating>
					</ActionsWrapper>
				</Container>
			</Section>
		</Floating>
	);
}

export default UserPanel;
