import React from "react";
import { FlatList, Text } from "react-native";

interface CriteriaListProps {
  criteria: { id: number; attribute: string }[];
}

const CriteriaList: React.FC<CriteriaListProps> = ({ criteria }) => (
  <FlatList
    data={criteria}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <Text style={{ fontSize: 14, marginVertical: 2 }}>{item.attribute}</Text>}
    scrollEnabled={false}
  />
);

export default CriteriaList;
