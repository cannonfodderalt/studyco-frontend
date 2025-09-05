import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { SpotDetail } from "@/types";
import { API_URL } from "@/config";
import ImageGallery from "./ImageGallery";
import BusynessSelector from "./BusynessSelector";
import CriteriaList from "./CriteriaList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "../ui/IconSymbol";

export interface SpotBottomSheetRef {
  open: (spot: SpotDetail) => void;
  close: () => void;
}

interface SpotBottomSheetProps {
  scores: { id: number; rank: string; description: string }[];
}

const SpotBottomSheet = forwardRef<SpotBottomSheetRef, SpotBottomSheetProps>(
  ({ scores }, ref) => {
    const [spot, setSpot] = useState<SpotDetail | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedScore, setSelectedScore] = useState<number | null>(null);
    const [recentBusyness, setRecentBusyness] = useState<any | null>(null);
    const [loadingBusyness, setLoadingBusyness] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);

    // Load favourite state whenever a new spot opens
    useEffect(() => {
      if (spot) {
        checkIfFavourite(spot.id);
      }
    }, [spot]);

    const checkIfFavourite = async (spotId: number) => {
      try {
        const favs = await AsyncStorage.getItem("favourites");
        const favList = favs ? JSON.parse(favs) : [];
        setIsFavourite(favList.includes(spotId));
      } catch (e) {
        console.error("Error checking favourites", e);
      }
    };

    const toggleFavourite = async () => {
      if (!spot) return;
      try {
        const favs = await AsyncStorage.getItem("favourites");
        let favList = favs ? JSON.parse(favs) : [];

        if (favList.includes(spot.id)) {
          // remove
          favList = favList.filter((id: number) => id !== spot.id);
          setIsFavourite(false);
        } else {
          // add
          favList.push(spot.id);
          setIsFavourite(true);
        }

        await AsyncStorage.setItem(
          "favourites",
          JSON.stringify(favList.map(Number))
        );

        console.log("Updated favourites:", favList);
      } catch (e) {
        console.error("Error updating favourites", e);
      }
    };

    useImperativeHandle(ref, () => ({
      open: (spotData: SpotDetail) => {
        setIsVisible(true);
        setTimeout(() => {
          setSpot(spotData);
          fetchRecentBusyness(spotData.id);
        }, 0);
      },
      close: () => {
        setIsVisible(false);
        setSpot(null);
        setSelectedScore(null);
        setRecentBusyness(null);
      },
    }));

    const fetchRecentBusyness = async (spotId: number) => {
      try {
        setLoadingBusyness(true);
        const res = await fetch(`${API_URL}/busyness/${spotId}/spot/`);
        if (!res.ok) throw new Error("Failed to fetch busyness");
        const data = await res.json();
        setRecentBusyness(data); // backend already gives average + last_review
      } catch (error) {
        console.error("Error fetching busyness:", error);
        setRecentBusyness(null);
      } finally {
        setLoadingBusyness(false);
      }
    };

    const submitBusyness = async () => {
      if (!spot || !selectedScore) {
        Alert.alert("Please select a busyness score first");
        return;
      }
      try {
        const res = await fetch(`${API_URL}/busyness/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studySpot: spot.id, score: selectedScore }),
        });

        if (!res.ok) throw new Error("Failed to submit");

        // re-fetch to update the most recent review right away
        fetchRecentBusyness(spot.id);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to submit busyness");
      }
    };

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setIsVisible(false)}
        hideModalContentWhileAnimating
        backdropColor="transparent"
        style={styles.modal}
      >
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          {spot ? (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>{spot.name}</Text>
                <TouchableOpacity onPress={toggleFavourite}>
                  <IconSymbol
                    size={18}
                    name={isFavourite ? "star.fill" : "star"}
                    color={isFavourite ? "#FFD700" : "#ccc"}
                  ></IconSymbol>
                </TouchableOpacity>
              </View>

              <ImageGallery images={spot.image_url ?? []} />

              <View>
                <Text style={styles.subtitle}>
                  BUSYNESS:{" "}
                  {loadingBusyness
                    ? "Loading..."
                    : recentBusyness && recentBusyness.average !== null
                    ? scores.find(
                        (s) => s.id === Math.round(recentBusyness.average)
                      )?.rank ?? recentBusyness.average
                    : "No recent busyness reports"}
                </Text>

                {recentBusyness?.last_review && (
                  <Text>
                    Last review:{" "}
                    {new Date(recentBusyness.last_review).toLocaleString()}
                  </Text>
                )}
              </View>

              <Text style={styles.subtitle}>Tags:</Text>
              <CriteriaList criteria={spot.criteria} />

              <Text style={styles.subtitle}>Submit a Busyness Score:</Text>
              <BusynessSelector
                scores={scores}
                selectedScore={selectedScore}
                onSelect={setSelectedScore}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitBusyness}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <Text>No spot selected</Text>
          )}
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "transparent",
  },
  sheet: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default SpotBottomSheet;
