import React, { Component } from 'react';
import { getPatientInfoForDoctor, addDose } from '../utils/eth-util';
import {  Button, Input, message, Row, Col,  Card} from 'antd';
import { connect } from "react-redux";
import { setAuthData } from "../actions/auth";


class DisplayPatient extends Component {

    constructor(props){
        super(props);
    }

    state = {
        patient_name:"",
        patient_age:0,
        patient_doses:0,
        patient_doseType:"",
        patient_doseDate:"",
        patient_infectionDate:"",
        showPopup:[],
    }

    componentWillMount() {
        if(this.props.patient_address)
            getPatientInfoForDoctor(this.props.patient_address, (data) => {
                this.setState({patient_name:data[0],patient_age:data[1].toNumber(),patient_doses:parseInt(data[2])}
                );
            });
        }

    async addADose(){
        let { CovidRecord, web3 } = this.props.global_vars;
        let { patient_doseType, patient_doseDate ,patient_doses} = this.state;
        if(patient_doseType && patient_doseDate){
            let res = await CovidRecord.addDose
            .sendTransaction(this.props.patient_address, patient_doseType, patient_doseDate,{"from":web3.eth.accounts[0]});
            
            if(res) {
                message.success('Dose added');
                this.setState({patient_doses});
                this.setState({patient_doseType:"", patient_doseDate:""});
            }
        }
    }
    async addAnInfection(){
        let { CovidRecord, web3 } = this.props.global_vars;
        let { patient_infectionDate} = this.state;
        if(patient_infectionDate ){
            let res = await CovidRecord.addInfection
            .sendTransaction(this.props.patient_address, patient_infectionDate,{"from":web3.eth.accounts[0]});
            
            if(res) {
                message.success('Infection added');
                this.setState({patient_infectionDate:""});
            }
        }
    }
    onTextChange(type, e){
        if(e && e.target)
            this.setState({[type]:e.target.value});
    }
    render() {
        let { patient_address } = this.props;
        let { patient_name, patient_age, patient_doses,  patient_doseType,patient_doseDate,patient_infectionDate} = this.state;
        let { token } = this.props.auth;

        return(

            
            <div>
                <Card bordered={true} style={flexStyle}>
                    <h4>Patient Address: {patient_address}</h4>
                    <h4> Patient Name: {patient_name}</h4>
                    <h4>Patient Age: {patient_age}</h4>
                    <h4>Number of Doses: {patient_doses}</h4>
                </Card>
                <Row gutter={16} style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                <Col className='col-3' span={12}>

                    <Card bordered={true}>
                        <div style={flexStyle}>
                            <Input className='emailId' style={{width:"100%"}} value={patient_doseType} onChange={this.onTextChange.bind(this, 'patient_doseType')} size="small" placeholder="Vaccin Type"/>
                            <Input className='emailId' style={{width:"100%"}} value={patient_doseDate} onChange={this.onTextChange.bind(this, 'patient_doseDate')} size="small" placeholder="Vaccin Date"/>
                            <Button type="primary" onClick={this.addADose.bind(this)} htmlType="submit" className="login-form-button loginButton">
                                Add Dose
                            </Button>
                        </div>
                    </Card>
                    </Col>

                <Col className='col-3' span={12}>
  
            <Card bordered={true}>
                        <div style={flexStyle}>
                            <Input className='emailId' style={{width:"100%"}} value={patient_infectionDate} onChange={this.onTextChange.bind(this, 'patient_infectionDate')} size="small" placeholder="Inefction Date"/>
                            <Button type="primary" onClick={this.addAnInfection.bind(this)} htmlType="submit" className="login-form-button loginButton">
                                Add Infection
                            </Button>
                        </div>
                    </Card>
                    </Col>

                    </Row>

            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

const mapStateToProps = (state) => {
    return {
      global_vars: state.global_vars,
      auth: state.auth
    };
};
const actionCreators = {
    setAuthData
}

export default connect(mapStateToProps, actionCreators)(DisplayPatient);