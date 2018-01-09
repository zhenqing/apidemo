import React from 'react';
import SortableTree from 'react-sortable-tree';
var api = require('../../utils/api.js');

const rawData = [];
export default class Role extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: rawData,
            loading: true
        };

    }

    componentDidMount() {
        api.fetchRoles()
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
    }


    render() {
        return (
            <div style={{  }}>
                <SortableTree
                    treeData={this.state.data}
                    onChange={data => this.setState({ data })}/>
            </div>
        )
    }

}