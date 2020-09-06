import styled from 'styled-components/native';
import { Dimensions, Animated } from 'react-native';

export const Container = styled.View`
height: ${Dimensions.get('window').height}px;
width: ${Dimensions.get('window').width}px;
`;

export const Content = styled(Animated.View)`
  height: ${Dimensions.get('window').height}px;
  width: ${Dimensions.get('window').width}px;
`;

export const DashboardContainer = styled(Animated.View)`
  height: ${Dimensions.get('window').height}px;
  width: ${Dimensions.get('window').width}px;

  background-color: #f3f3f3;

  z-index: 99;
`;

export const LeftPageContainer = styled(Animated.View)`
  height: ${Dimensions.get('window').height}px;
  width: ${Dimensions.get('window').width}px;

  position: absolute;

  z-index: 1;

  background-color: #333;
`;

export const RightPageContainer = styled(Animated.View)`
  height: ${Dimensions.get('window').height}px;
  width: ${Dimensions.get('window').width}px;

  position: absolute;

  z-index: 1;

  background-color: #777;
`;
