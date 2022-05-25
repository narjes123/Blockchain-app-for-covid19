import React, { Component } from 'react';
import {  Row, Col, Card, Tag } from 'antd';
import { connect } from "react-redux";
import DisplayPatient from "./display_patient";

class Doctor extends Component {

    constructor(props){
        super(props);
    }

    state = {
        name: "",
        patient_list: [],
        load_patient:""
    }

    componentDidMount(){
        let { CovidRecord } = this.props.global_vars;
        
        if(CovidRecord)
            this.loadDoctor(CovidRecord);
    }

    componentWillReceiveProps(nextProps){
        let { CovidRecord } = this.props.global_vars;
        if(CovidRecord !== nextProps.global_vars.CovidRecord) {
            this.loadDoctor(nextProps.global_vars.CovidRecord);   
        }
    }

    async loadDoctor(CovidRecord){
        let res = await CovidRecord.getDoctorInfo.call();
        this.setState({name:res[0],patient_list:res[1]});
    }

    render() {
        let { name, patient_list } = this.state;
        return (
            <div>
                <Card bordered={true}>
                    <div>
                        name: {name}
                    </div>
                </Card>
                <Row gutter={16} style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <Col className='col-sm-10' span={10}>
                        <Card bordered={true} style={flexStyle}>
                            { 
                                patient_list.map((patient) => {
                                    return <Tag onClick={()=>this.setState({load_patient:patient})}>{patient}</Tag>
                                }) 
                            }
                        </Card>
                    </Col>
					<br/>
                    <Col className='col-sm-6' span={6} style={{width: "58%"}}>
                        {
                            this.state.load_patient ?
                            <DisplayPatient patient_address={this.state.load_patient} /> :
                            null
                        }
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
      auth: state.auth,
      global_vars: state.global_vars
    };
};

export default connect(mapStateToProps, {})(Doctor);