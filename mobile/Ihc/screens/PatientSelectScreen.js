/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  CheckBox,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as data from '../services/FakeDataService';
import PatientTable, {tableStyles} from '../components/PatientTable';

export default class PatientSelectScreen extends Component<{}> {
  constructor(props) {
    super(props);

    this.rowNum = 0;
    this.tableHeaders = ['Name', 'Birthday', 'Checkin', 'Triage', 'Doctor',
            'Pharmacy', 'Notes'];
    this.state = {
      loading: false,
      rows: [],
      error: null
    };
  }

  goToWelcome = () => {
    this.props.navigator.push({
      screen: 'Ihc.WelcomeScreen',
      title: 'Welcome'
    });
  }

  loadPatients = () => {
    this.setState({ loading: true });
    data.getPatientSelectRows()
      .then( data => {
        this.setState({ rows: data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.loadPatients();
  }

  // TODO: Currently hardcoding in patientInfo, update that
  // Also need to modify service call to include identifying information
  goToPatient = (patient) => {
    this.props.navigator.push({
      screen: 'Ihc.PatientHomeScreen',
      title: patient.name,
      passProps: { patientInfo: { name: patient[0] } }
    });
  }

  renderRow = (data, keyFn) => {
    const cols = data.map( (e,i) => (
      <View style={tableStyles.col} key={keyFn(i)}>
        {( () => {
          // TODO: format birthday, add ability to add notes
          switch(i) {
            case 2: //checkin time
            case 3:
            case 4:
            case 5:
              // No checkin time provided
              if(!e)
                return <Text></Text>

              const date = new Date(e);
              // TODO: update checkintime format
              return <Text>{`${date.getHours()}:${date.getMinutes()}`}</Text>
              break;
            default:
              return <Text>{e}</Text>
          }
        })() }
      </View>
    ) );
    return (
      <TouchableOpacity style={tableStyles.rowContainer}
          key={`row${this.rowNum++}`} onPress={() => this.goToPatient(data)}>
        <View style={tableStyles.rowContainer} key={keyFn(cols.length)}>
          {cols}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if(this.state.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            Select a Patient
          </Text>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Select a Patient
        </Text>

        <PatientTable
          headers={this.tableHeaders}
          rows={this.state.rows}
          loading={this.state.loading}
          renderRow={this.renderRow}
        />

        <Button onPress={this.goToWelcome}
          title="Back to home" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});