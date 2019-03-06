/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import uuidv4 from '../utils/Utils';

const GlobalContext = React.createContext({
  value: {
    beacons: [],
    addBeacon: this.addBeacon,
    updateBeacon: this.updateBeacon,
    deleteBeacon: this.deleteBeacon,
  },
});

export class GlobalContextProvider extends React.Component {
  state = {
    beacons: [],
  };

  addBeacon = (props) => {
    const { beacons } = this.state;
    this.setState({
      beacon: [
        ...beacons,
        {
          key: uuidv4,
          title: props.title,
          phone: props.phone,
        },
      ],
    });
  };

  updateBeacon = (id, props) => {};

  deleteBeacon = (id) => {};

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          addBeacon: this.addBeacon,
          updateBeacon: this.updateBeacon,
          deleteBeacon: this.deleteBeacon,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {context => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
