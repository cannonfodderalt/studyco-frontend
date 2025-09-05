import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";

interface CriteriaListProps {
  criteria: { id: number; attribute: string }[];
}

const CriteriaList: React.FC<CriteriaListProps> = ({ criteria }) => (
  <FlatList
    data={criteria}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.chip}>
        <Text style={styles.chipText}>{item.attribute}</Text>
      </View>
    )}
    numColumns={3} // let them wrap into rows (adjust to fit screen width)
    columnWrapperStyle={styles.row}
    scrollEnabled={false}
  />
);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexWrap: "wrap", // allows wrapping to next line
  },
});

export default CriteriaList;
