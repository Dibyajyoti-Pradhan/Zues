import React, {useState, useEffect} from 'react';
// import Routes from './src/Routes';
import {
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
const images = [
  {id: 1, src: require('./assets/image1.jpg')},
  {id: 3, src: require('./assets/image3.jpg')},
  {id: 2, src: require('./assets/image2.jpg')},
  {id: 5, src: require('./assets/image5.jpg')},
  {id: 4, src: require('./assets/image4.jpg')},
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let allImages = {};
let oldPosition = {};
let viewImage;
let position = new Animated.ValueXY();
let dimensions = new Animated.ValueXY();
let animation = new Animated.Value(0);
const App = () => {
  const [activeImage, setActiveImage] = useState(null);

  const openImage = (index) => {
    allImages[index].measure((x, y, width, height, pageX, pageY) => {
      oldPosition.x = pageX;
      oldPosition.y = pageY;
      oldPosition.width = width;
      oldPosition.height = height;
      position.setValue({
        x: pageX,
        y: pageY,
      });
      dimensions.setValue({
        x: width,
        y: height,
      });
      setActiveImage(images[index]);

      console.log('Active', JSON.stringify(activeImage));
      console.log('old', oldPosition);
      console.log('pos', position);
      console.log('dims', dimensions);
    });
  };

  const animatedContentY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 0],
  });

  const animatedContentOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1],
  });

  const animatedContentStyle = {
    opacity: animatedContentOpacity,
    transform: [
      {
        translateY: animatedContentY,
      },
    ],
  };
  const animatedCrossOpacity = {
    opacity: animation
  }

  const closeImage = () => {
    Animated.parallel([
      Animated.timing(position.x, {
        toValue: oldPosition.x,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(position.y, {
        toValue: oldPosition.y,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(dimensions.x, {
        toValue: oldPosition.width,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(dimensions.y, {
        toValue: oldPosition.height,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => setActiveImage(null));

  }

  useEffect(() => {
    if (activeImage) {
      console.log('useEffect Active', activeImage);

      // if(activeImage && position && dimensions) {
      viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
        Animated.parallel([
          Animated.timing(position.x, {
            toValue: dPageX,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(position.y, {
            toValue: dPageY,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(dimensions.x, {
            toValue: dWidth,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(dimensions.y, {
            toValue: dHeight,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();

        console.log('useEffect viewImage', viewImage);
        console.log('dx', dx);
        console.log('dy', dy);
        console.log('dWidth', dWidth);
        console.log('dHeight', dHeight);
        console.log('dPageX', dPageX);
        console.log('dPageY', dPageY);
      });
    }
  }, [activeImage]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        {images.map((image, index) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => openImage(index)}
              key={image.id}>
              <Animated.View
                style={{
                  height: SCREEN_HEIGHT - 150,
                  width: SCREEN_WIDTH,
                  padding: 15,
                }}>
                <Image
                  ref={(image) => (allImages[index] = image)}
                  source={image.src}
                  style={{
                    flex: 1,
                    height: null,
                    width: null,
                    borderRadius: 20,
                  }}
                  resizeMode="cover"
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={activeImage ? 'auto' : 'none'}>
        <View
          style={{flex: 2, zIndex: 1001}}
          ref={(view) => (viewImage = view)}
          collapsable={false}>
          <Animated.Image
            source={activeImage ? activeImage.src : null}
            style={[
              {
                resizeMode: 'cover',
                top: 0,
                left: 0,
                height: null,
                width: null,
              },
              {
                width: dimensions.x,
                height: dimensions.y,
                left: position.x,
                top: position.y,
              },
            ]}/>
            <TouchableWithoutFeedback onPress={() => closeImage()}>
              <Animated.View style={[{position: 'absolute', top: 30, right: 30}, animatedCrossOpacity]}>
                <Text style = {{fontSize: 24, fontWeight: 'bold', color: 'white'}}>
                  X
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
        </View>
        <Animated.View
          style={[{
            flex: 1,
            zIndex: 1000,
            backgroundColor: 'white',
            padding: 20,
            paddingTop: 50,
          }, animatedContentStyle]}>
          <Text style={{fontSize: 24, paddingBottom: 10}}>
            Dibyajyoti Pradhan
          </Text>

          <Text style={{fontSize: 15}}>
            Dolore incididunt exercitation occaecat cillum amet tempor occaecat
            duis anim. Mollit ex officia sint dolore irure dolore ullamco velit
            sunt pariatur adipisicing est aute. Minim in eu deserunt ullamco ad
            irure labore. Quis nostrud consequat elit dolore. Consectetur in
            labore eu do cillum et nostrud.
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default App;
