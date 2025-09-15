import 'dotenv/config';

export default {
  expo: {
    name: "StudyCo",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/studyco-icon.png",
    scheme: "frontend",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.studyco.frontend",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.studyco.frontend",
      usesCleartextTraffic: true,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/studyco-icon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/studyco-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "63a8614b-c5f7-48dd-aa52-8c14966e3d72"
      }
    }
  }
};
