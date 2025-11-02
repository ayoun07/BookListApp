import React from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type RatingValue = number;

export type RatingStarsProps = {
  value: RatingValue;
  onChange?: (next: RatingValue) => void;
  max?: number;
  size?: number;
  colorActive?: string;
  colorInactive?: string;
  spacing?: number;
  readOnly?: boolean;
  allowReset?: boolean;
  style?: ViewStyle;
  testID?: string;
};

function clampRating(value: number, max: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(max, Math.floor(value)));
}

function RatingStarsBase({
  value,
  onChange,
  max = 5,
  size = 28,
  colorActive = "#F59E0B",
  colorInactive = "#9CA3AF",
  spacing = 6,
  readOnly = false,
  allowReset = true,
  style,
  testID,
}: RatingStarsProps) {
  const safeValue = clampRating(value ?? 0, max);
  const stars = React.useMemo(() => Array.from({ length: max }), [max]);

  return (
    <View style={[styles.row, style]} testID={testID}>
      {stars.map((_, i) => {
        const index = i + 1;
        const filled = safeValue >= index;
        const handlePress = () => {
          if (!readOnly) onChange?.(index);
        };
        const handleLongPress = () => {
          if (!readOnly && allowReset) onChange?.(0);
        };
        return (
          <TouchableOpacity
            key={i}
            style={{ paddingHorizontal: Math.max(0, spacing / 2) }}
            onPress={handlePress}
            onLongPress={handleLongPress}
            disabled={readOnly}
            accessibilityRole="button"
            accessibilityLabel={
              readOnly
                ? `Note ${safeValue} sur ${max}`
                : `Donner ${index} étoile${index > 1 ? "s" : ""}`
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={size}
              color={filled ? colorActive : colorInactive}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const RatingStars = React.memo(RatingStarsBase);
export default RatingStars;
