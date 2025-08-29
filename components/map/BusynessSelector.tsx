import React from "react";
import { FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

interface BusynessSelectorProps {
  scores: { id: number; rank: string; description: string }[];
  selectedScore: number | null;
  onSelect: (id: number) => void;
}

const BusynessSelector: React.FC<BusynessSelectorProps> = ({ scores, selectedScore, onSelect }) => (
  <FlatList
    data={scores}
    horizontal
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[styles.button, selectedScore === item.id && styles.buttonSelected]}
        onPress={() => onSelect(item.id)}
      >
        <Text style={[styles.text, selectedScore === item.id && styles.textSelected]}>
          {item.rank}
        </Text>
        <Text style={styles.desc}>{item.description}</Text>
      </TouchableOpacity>
    )}
    showsHorizontalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  button: {
    padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    marginRight: 8, alignItems: "center",
  },
  buttonSelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  text: { fontSize: 16, fontWeight: "600", color: "#333" },
  textSelected: { color: "white" },
  desc: { fontSize: 12, color: "#666" },
});

export default BusynessSelector;
