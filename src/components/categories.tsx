import { connect } from 'react-redux';
import * as React from 'react';

import {
  ListPost as DefaultListPost
} from './post';

class CategoryListComponent extends React.Component {
  state: {
    expandedCategories: Array<string>
  };
  props: {
    categories: any,
    posts: any,
    ListPost: any
  };

  constructor(props) {
    super(props);

    if (props.params.category) {
      this.state.expandedCategories = [props.params.category];
    } else {
      this.state.expandedCategories = [];
    }
  }

  render() {
    let { categories, posts, ListPost } = this.props;
    ListPost = ListPost || DefaultListPost;
    return (
      <main>
        <h1>Categories</h1>
        { categories.filter((category) => category.forEach((id) => (
          <section key-id={`tag-${id}`}>
            <h1>{categories[id].label} ({categories[id].count})</h1>
            { posts.filter((post) => post.categories.indexOf(id) !== -1).forEach((post) => (
              <ListPost post={post}/>
            ))}
          </section>
        )))}
      </main>
    );
  }
}

export const CategoryList = connect((state) => ({
  categories: state.categories,
  posts: state.posts
}))(CategoryListComponent);
