import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import FavouritesList from "@/components/home/FavouritesList";
import { useSpots } from "@/components/SpotsContext";

export default function HomeScreen() {
  const { spots, loading } = useSpots();

  return (
    <View style={[styles.container, { backgroundColor: "#BFDBFE" }]}>
      <Text style={styles.greeting}>Hi</Text>
      <Text style={styles.subtext}>This is a home screen!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FavouritesList
          spots={spots}
          onSelect={(spot) => {
            console.log("Selected favourite spot:", spot);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
  },
});
