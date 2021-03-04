import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actUser from '../../actions/admin/actUser';
import ProfilePage from '../../pages/admin/ProfilePage';

class ProfileContainer extends Component {

    componentDidMount() {
        document.title = this.props.title_page;
    }

    onSubmit = (data) => {
        return this.props.actEditRequest(data);
    }

    render() {
        const { modelEdit, actGetAllRole, actGetUser } = this.props;
        return (
            <ProfilePage
                modelEdit={modelEdit}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                onGetAllRole={actGetAllRole}
                actGetUser={actGetUser}
            />
        );
    }
}

const mapState = state => ({
    modelEdit: state.dataEditReducer,
});
export default connect(mapState, actUser)(ProfileContainer);