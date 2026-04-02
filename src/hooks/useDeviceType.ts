import { useWindowDimensions } from 'react-native';

export function useDeviceType() {
  const { width, height } = useWindowDimensions();
  return {
    isTablet: width >= 768,
    isLandscape: width > height,
    width,
    height,
  };
}
