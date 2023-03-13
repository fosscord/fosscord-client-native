import 'moment-timezone';
import React from 'react';
import Moment from 'react-moment';
import {Animated, Platform, Pressable, StyleSheet} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import Message from '../stores/objects/Message';
import {CustomTheme} from '../types';
import {calendarStrings} from '../utils/i18n/date';
import Container from './Container';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ANIMATION_TIME = 50; // the duration of the hover animation

interface Props {
  message: Message;
  isHeader?: boolean;
}

function MessageItem({message, isHeader}: Props) {
  const theme = useTheme<CustomTheme>();
  const [bgColor] = React.useState(new Animated.Value(0));

  const onHoverIn = () => {
    if (!Platform.isWeb) {
      return;
    }
    Animated.timing(bgColor, {
      toValue: 1,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();
  };

  const onHoverOut = () => {
    if (!Platform.isWeb) {
      return;
    }
    Animated.timing(bgColor, {
      toValue: 0,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Container
      testID="message"
      flex={1}
      style={isHeader ? styles.containerHeader : undefined}>
      <AnimatedPressable
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        style={[
          Platform.isWeb
            ? {
                backgroundColor: bgColor.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    theme.colors.palette.background70,
                    theme.colors.palette.background65,
                  ],
                }),
                // @ts-ignore
                cursor: 'inherit',
              }
            : undefined,
          {flex: 1},
        ]}>
        <Container row flex={1} style={styles.container}>
          {isHeader && (
            <Avatar.Image
              testID="messageAvatar"
              size={40}
              source={{uri: message.author.avatarURL}}
              style={styles.avatar}
            />
          )}
          <Container
            testID="messageContentContainer"
            flex={1}
            style={!isHeader ? {marginLeft: 50} : undefined}>
            {isHeader && (
              <Container testID="messageHeader" row flex={1}>
                <Text testID="messageAuthor" style={styles.messageAuthor}>
                  {message.author.username}
                </Text>
                <Container>
                  <Moment
                    element={Text}
                    calendar={calendarStrings}
                    style={{
                      color: theme.colors.palette.gray100,
                      marginLeft: 10,
                    }}>
                    {message.timestamp}
                  </Moment>
                </Container>
              </Container>
            )}
            <Text
              style={[
                styles.messageContent,
                message.ghost ? {opacity: 0.5} : undefined,
              ]}>
              {message.content}
            </Text>
          </Container>
        </Container>
      </AnimatedPressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    marginTop: 17,
  },
  container: {
    paddingVertical: 2,
    paddingLeft: 12,
  },
  avatar: {
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  messageAuthor: {
    fontFamily: 'SourceSans3-Semibold',
  },
  messageContent: {
    fontFamily: 'SourceSans3-Light',
  },
});

export default React.memo(MessageItem);
