import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Spot } from "@/types";

interface FavouritesListProps {
  spots: Spot[];
  onSelect?: (spot: Spot) => void;
}

const FavouritesList: React.FC<FavouritesListProps> = ({ spots, onSelect }) => {
  const [favourites, setFavourites] = useState<number[]>([]);

  const loadFavourites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favourites");
      const favList: number[] = favs ? JSON.parse(favs) : [];
      setFavourites(favList.map((id) => Number(id)));
    } catch (e) {
      console.error("Error loading favourites", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [])
  );

  const favouriteSpots = spots.filter((s) => favourites.includes(s.id));

  if (favouriteSpots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favourites yet ⭐</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>⭐ Your Favourites</Text>
      <FlatList
        data={favouriteSpots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onSelect?.(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginTop: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemText: { fontSize: 16, color: "#333" },
  emptyContainer: { padding: 12, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
});

export default FavouritesList;
