import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteCustomization } from "../../admin/branding/branding.actions";

class CustomizationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteId: -1
    };
  }

  onDeleteClick(id) {
    this.setState({ deleteId: id });
  }

  onDeleteCancelClick() {
    this.setState({ deleteId: -1 });
  }

  render() {
    const { customizations, deleteCustomization } = this.props;
    let customizationLines = [];
    if (customizations.length > 0) {
      customizationLines = customizations.map(c =>
        <div key={c.id} className="customization-line">
          <h2>{c.name}</h2>
          <div className="customization-actions">
            <Link className="button" to={{ pathname: "/admin/customizer", search:`?id=${c.id}` }}>Edit</Link>
            <Link className="button" to={{ pathname: "/admin/branding", search:`?id=${c.id}` }}>Brand</Link>
            { this.state.deleteId === c.id
              ? <React.Fragment>
                <span className="button delete-btn" onClick={() => deleteCustomization(c.id)}>Delete</span>
                <span className="button" onClick={() => this.onDeleteCancelClick(c.id)}>Cancel</span>
              </React.Fragment>
              : <span className="material-icons delete" onClick={() => this.onDeleteClick(c.id)}>delete</span>
            }
          </div>
        </div>
      );
    }

    return <div className="customization-table card">{customizationLines}</div>;
  }
}

CustomizationTable.propTypes = {
  customizations: PropTypes.array,
  deleteCustomization: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    deleteCustomization: (id) => dispatch(deleteCustomization(id))
  };
};

export default connect(null, mapDispatchToProps)(CustomizationTable);
