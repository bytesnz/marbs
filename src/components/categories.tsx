import { connect } from 'react-redux';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';

import config from '../app/lib/config';

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

const CategoriesComponent = ({ categories, actions }) => {
  if (categories === null) {
    actions.categories.fetchCategories();
    return null;
  }

  if (categories.data) {
    categories = categories.data;
  } else {
    return null;
  }

  return (
    <ul className="categories">
      { Object.keys(categories).sort().map((id) => (
        <li key={id}>
          <Link to={urlJoin(config.baseUri, config.categoriesUri +
              (config.categoriesPerPage ? '' : '#') + id)}>
            {id} ({categories[id]})
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Categories = connect((state) => ({
  categories: state.categories
}))(CategoriesComponent);
