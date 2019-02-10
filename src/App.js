import React, { Component } from "react";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Title,
  Caption,
  Paragraph,
  Card,
  Button,
  FAB,
  Surface,
  BottomNavigation
} from "react-native-paper";
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import MyAppBar from "./components/MyAppBar";

const battaryFull = <Icon name="battery-full" size={24} color="green" />;
const battaryThreeQuarters = <Icon name="battery-three-quarters" size={24} />;
const battaryHalf = <Icon name="battery-half" size={24} />;
const battaryQuarter = <Icon name="battery-quarter" size={24} color="red" />;
const battaryEmpty = <Icon name="battery-empty" size={24} color="red" />;

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#388e3c",
    accent: "#00600f"
  }
};

const ListRoute = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Card style={styles.card}>
      <Card.Content style={styles.description}>
        <View style={styles.text}>
          <View style={styles.status}>
            {battaryFull}
            <Paragraph style={styles.date}>10.02.2019</Paragraph>
          </View>

          <Title>Моя основная система</Title>
          <Paragraph>Номер: +7 (916) 132-12-14</Paragraph>
          <Paragraph>N: 5554.2500 E: 03723.1608</Paragraph>
        </View>
        <Image
          source={require("../assets/pasport1.jpg")}
          style={styles.image}
        />
      </Card.Content>

      <Card.Actions>
        <Button>Поиск</Button>
        <Button>Статус</Button>
        <Button>Редактировать</Button>
      </Card.Actions>
    </Card>

    <Card style={styles.card}>
      <Card.Content style={styles.description}>
        <View style={styles.text}>
          <View style={styles.status}>
            {battaryQuarter}
            <Paragraph style={styles.date}>02.02.2019</Paragraph>
          </View>

          <Title>Студенческая система</Title>
          <Paragraph>Номер: +7 (916) 421-99-01</Paragraph>
          <Paragraph>N: 5553.9613 E: 03143.1127</Paragraph>
        </View>
        <Image
          source={require("../assets/pasport2.jpg")}
          style={styles.image}
        />
      </Card.Content>

      <Card.Actions>
        <Button>Поиск</Button>
        <Button>Статус</Button>
        <Button>Редактировать</Button>
      </Card.Actions>
      <Surface style={styles.surface}>
        <Text style={{ color: "white" }}>2</Text>
      </Surface>
    </Card>
  </ScrollView>
);

type Props = {};
export default class App extends Component<Props> {
  state = {
    index: 0,
    routes: [
      { key: "list", title: "Список маяков", icon: "list" },
      { key: "settings", title: "Настройки", icon: "settings" }
    ]
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    list: ListRoute,
    settings: ListRoute
  });

  render() {
    return (
      <PaperProvider theme={theme}>
        <MyAppBar />

        <BottomNavigation
          navigationState={this.state}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
        />
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  surface: {
    width: 32,
    height: 32,
    position: "absolute",
    right: 32,
    top: -16,
    padding: 8,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    borderRadius: 16
  },
  date: {
    margin: 4
  },
  status: {
    flexDirection: "row"
  },
  text: {
    flex: 3
  },
  image: {
    width: 130,
    height: 130
  },
  description: {
    flexDirection: "row"
  },
  container: {
    flex: 1
  },
  content: {
    padding: 4
  },
  card: {
    margin: 4,
    elevation: 4
  }
});
