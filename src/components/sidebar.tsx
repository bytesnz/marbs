import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { TagCloud } from './tags';
import { Posts } from './posts';
import { Categories } from './categories';
import { Menu } from './menu';

class SidebarComponent extends React.Component {
  state: {
    expanded: string,
  } = {
    expanded: null
  };

  props: {
    actions: any, // TODO
    /**
     * Allow the sidebar to be toggled
     */
    toggle?: boolean,
    /**
     * If true, menu will be toggled using a class instead of react rendering
     */
    toggleUsingClass?: boolean
    location: any
  };

  componentWillReceiveProps(newProps) {
    if (this.state.expanded && newProps.location.pathname !== this.state.expanded) {
      this.setState({
        expanded: null
      });
    }
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded ? this.props.location.pathname : null
    });
  }

  render() {
    const toggle = this.props.toggle ? (<button className="sidebarToggle" onClick={this.toggle} />) : null;

    const show = !this.props.toggle || this.state.expanded;

    if (show || this.props.toggleUsingClass) {
      return (
        <div className={'sidebar' + (this.props.toggleUsingClass && show ? ' expanded' : '')}>
          <div className="cover" />
          <div className="contents">
            {toggle}
            <h1>Navigation</h1>
            <Menu />
            <h1>Recent Posts</h1>
            { show ? (<Posts limit={10} actions={this.props.actions} />) : null }
            <h1>Tags</h1>
            { show ? (<TagCloud actions={this.props.actions} Label={({ tag, count }) => (<Link to="">{tag} ({count})</Link>)} />) : null }
            <h1>Categories</h1>
            {show ? (<Categories actions={this.props.actions} />) : null }
          </div>
        </div>
      );
    } else {
      return toggle;
    }
  }
};

export const Sidebar = withRouter(SidebarComponent);
