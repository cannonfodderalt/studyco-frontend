import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const prevImage = () =>
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const nextImage = () => setCurrentIndex((i) => (i + 1) % images.length);

  if (!images || images.length === 0) return <Text>No images available</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={StyleSheet.absoluteFill}
          />
        )}
        <Image
          source={{ uri: images[currentIndex] }}
          style={styles.image}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      {/* Navigation arrows */}
      <TouchableOpacity style={[styles.arrow, { left: 10 }]} onPress={prevImage}>
        <ChevronLeft size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.arrow, { right: 10 }]} onPress={nextImage}>
        <ChevronRight size={24} color="white" />
      </TouchableOpacity>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  imageWrapper: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // placeholder
  },
  image: { width: "100%", height: "100%" },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },
  dotsContainer: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  dotActive: { backgroundColor: "rgba(0,122,255,1)" },
  dotInactive: { backgroundColor: "rgba(0,122,255,0.3)" },
});

export default ImageGallery;
