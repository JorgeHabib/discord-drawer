import React, {
  useCallback, useRef, useState, useEffect,
} from 'react';
import { Animated, useWindowDimensions, Easing } from 'react-native';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

import Dashboard from '../Dashboard';
import LeftPage from '../LeftPage';
import RightPage from '../RightPage';

import {
  Container,
  Content,
  DashboardContainer,
  LeftPageContainer,
  RightPageContainer,
} from './styles';

const MainPage: React.FC = () => {
  const [showLeftPage, setShowLeftPage] = useState(false);

  const offset = useRef(0);
  const currentX = useRef(0);
  const translateX = useRef(new Animated.Value(0));

  const leftDrawerOpened = useRef(false);
  const rightDrawerOpened = useRef(false);
  const isReturningToDashboard = useRef(false);

  const { width } = useWindowDimensions();

  useEffect(() => {
    translateX.current.addListener(({ value }) => {
      currentX.current = value;
    });

    return () => translateX.current.removeAllListeners();
  }, []);

  const translateXValue = translateX.current.interpolate({
    inputRange: [-0.9 * width, 0.9 * width],
    outputRange: [-0.90 * width, width * 0.90],
    extrapolate: 'clamp',
  });

  const animateDrawer = (toValue: number) => {
    Animated.timing(translateX.current, {
      toValue,
      duration: 240,
      useNativeDriver: true,
      easing: Easing.bezier(0.44, 0.77, 0.78, 0.76),
      // easing: Easing.linear,
    }).start(() => {
      offset.current = toValue;
      translateX.current.setOffset(offset.current);
      translateX.current.setValue(0);
    });
  };

  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX.current,
        },
      },
    ],
    { useNativeDriver: true },
  );

  const handlePanGestureOnDashboard = useCallback((event: PanGestureHandlerStateChangeEvent) => {
    const { translationX } = event.nativeEvent;

    // if (currentX.current > 0) {
    //   setShowLeftPage(true);
    // } else {
    //   setShowLeftPage(false);
    // }
    console.log('translation', translationX);
    console.log('current', currentX.current);

    if (currentX.current < 0) {
      setShowLeftPage(false);
    } else if (currentX.current > 0) {
      setShowLeftPage(true);
    }

    // End of Animation
    if (event.nativeEvent.oldState === State.ACTIVE) {
      offset.current += translationX;

      const isGoingLeft = translationX >= 100 && !rightDrawerOpened.current;
      const isGoingRight = translationX <= -100 && !leftDrawerOpened.current;

      if (isGoingLeft) {
        isReturningToDashboard.current = false;
        leftDrawerOpened.current = true;
        // setShowLeftPage(true);
      } else if (isGoingRight) {
        isReturningToDashboard.current = false;
        rightDrawerOpened.current = true;
        // setShowLeftPage(false);
      } else {
        translateX.current.setValue(offset.current);
        translateX.current.setOffset(0);

        offset.current = 0;
        currentX.current = 0;

        leftDrawerOpened.current = false;
        rightDrawerOpened.current = false;
        isReturningToDashboard.current = true;
      }

      if (leftDrawerOpened.current) {
        animateDrawer(width * 0.9);
      } else if (rightDrawerOpened.current) {
        animateDrawer(width * -0.9);
      } else {
        animateDrawer(0);
      }
    }

    // const shouldNotChange = !rightDrawerOpened.current && !leftDrawerOpened.current && isReturningToDashboard.current;

    // if (shouldNotChange) {
    //   isReturningToDashboard.current = false;
    //   return;
    // }

    // if (translationX >= 10) {
    //   setShowLeftPage(true);
    // } else if (translationX <= -10) {
    //   setShowLeftPage(false);
    // }
  }, [width]);

  const handlePanGestureOnSides = useCallback((event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      offset.current += translationX;

      translateX.current.setValue(offset.current);
      translateX.current.setOffset(0);

      offset.current = 0;

      leftDrawerOpened.current = false;
      rightDrawerOpened.current = false;
      isReturningToDashboard.current = true;

      animateDrawer(0);
    }
  }, []);

  return (
    <Container>
      <Content>
        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={handlePanGestureOnDashboard}
        >
          <DashboardContainer
            style={{
              transform: [
                {
                  translateX: translateXValue,
                },
              ],
            }}
          >
            <Dashboard />

          </DashboardContainer>
        </PanGestureHandler>

        {
          showLeftPage ? (
            <PanGestureHandler
              onGestureEvent={animatedEvent}
              onHandlerStateChange={handlePanGestureOnSides}
            >
              <LeftPageContainer>
                <LeftPage />
              </LeftPageContainer>
            </PanGestureHandler>
          )
            : (
              <PanGestureHandler
                onGestureEvent={animatedEvent}
                onHandlerStateChange={handlePanGestureOnSides}
              >
                <RightPageContainer>
                  <RightPage />
                </RightPageContainer>
              </PanGestureHandler>
            )
        }

      </Content>
    </Container>
  );
};

export default MainPage;
