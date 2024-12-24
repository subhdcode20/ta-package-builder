import { Image, StyleSheet, View } from "@react-pdf/renderer";

const BackgroundImageGradient = ({ imageSrc }) => {
  return (
    <View style={styles.backgroundImagecontainer1}>
      <Image style={styles.backgroundImage} src={imageSrc} fixed />
      {Array.from({ length: 40 }, (_, index) => (
        <View
          key={index}
          style={[
            styles.overlaySection,
            {
              top: `${index * 1.25}%`,
              height: '.5%',
              opacity: index * 0.025,
            },
          ]}
        />
      ))}
      {Array.from({ length: 40 }, (_, index) => (
        <View
          key={40 + index}
          style={[
            styles.overlaySection,
            {
              bottom: `${index * 1.25}%`,
              height: '.5%',
              opacity: index * 0.025,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImagecontainer1: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
    objectFit: "cover",
    top: 0,
    left: 0,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
    opacity: 0.5,
  },
  overlaySection: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
  },
});

export default BackgroundImageGradient;  