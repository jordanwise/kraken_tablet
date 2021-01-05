import React from 'react';

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

import { connect } from "react-redux";

import ConfiguredAppContainer from './ConfiguredAppContainer'

class AppAuthWrapper extends React.Component {

    componentDidMount() {
        // Set the AWS config from the login info stored in state
        this.setAwsConfig();
    }

    setAwsConfig() {
        let loginInfo = this.props.loginInfo

        let config = {
            Auth: {
                identityPoolId: loginInfo.identityPoolId,
                userPoolId: loginInfo.userPoolId,
                userPoolWebClientId: loginInfo.appClientId,
                region: loginInfo.region,
            },
            Storage: {
                AWSS3: {
                    bucket: loginInfo.bucketName,
                    region: loginInfo.region,
                    identityPoolId: loginInfo.identityPoolId,
                }
            },
            Analytics: {
                disabled: true
            },
        }

        Amplify.configure(config);
        Auth.configure(config);
    }

    render() {
        return (
            <ConfiguredAppContainer/>
        )
    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginReducer.loginInfo,
    }
}

export default connect(mapStateToProps)(AppAuthWrapper)
