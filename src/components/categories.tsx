import * as React from 'react';
import { Link } from 'react-router-dom';
import * as urlJoin from 'join-path';
import { connect } from '../lib/client/marss';

import config from '../app/lib/config';

import {
  categoryLabel,
  filterPostsByCategories
} from '../lib/utils';

import {
  Posts
} from './posts';

import { FilterListComponent } from './lib/filterList';

/**
 * Unconnected Component for generating lists of posts under each category
 */
class CategoryListComponent extends FilterListComponent {
  state: {
    expanded: Array<string>
  } = {
    expanded: null
  };
  props: {
    actions: any,
    categories: any,
    content: any,
    location: any,
    posts: any,
    ListPost: any
  };
  newHash: boolean = false;

  constructor(props) {
    super(props);

    if (props.categories === null) {
      props.actions.categories.fetchCategories();
    }

    if (props.posts === null) {
      props.actions.posts.fetchPosts();
    }

    if (config.categoriesPerPage) {
      //TODO
    } else {
      if (props.location && props.location.hash) {
        const category = props.location.hash.slice(1);
        this.newHash = true;
        this.state.expanded = [category];
      } else {
        this.state.expanded = [];
      }
    }
  }

  shouldScroll() {
    return this.props.categories && this.props.categories.data;
  }

  error(errorSource: string, error) {
    return (
      <p className="error" key={errorSource}>
        There is was an error getting the { errorSource }:
        { error.message }
      </p>
    );
  }

  render() {
    let { categories, content, posts, actions } = this.props;

    return [
      content ? null : (
        <header key="header">
          <h1>Categories</h1>
        </header>
      ),
      (() => {
        if (!categories) {
          return 'Loading categories list';
        } else if (categories.error) {
          return this.error('categories', categories.error);
        } else if (posts && posts.error) {
          return this.error('posts', posts.error);
        } else if (config.categoriesPerPage) {
          return null;
        } else {
          return Object.keys(categories.data).map((id) => {
            const category = id.split('/').pop();

            return (
              <section className="postList" key={`category-${category}`}>
                <h1>
                  <a id={id}/>
                  {categoryLabel(id)} ({categories.data[id]})
                </h1>
                { !config.expandableLists || this.isExpanded(id)
                    ? (posts && posts.data ? (<Posts
                    posts={filterPostsByCategories(posts.data, [category])}
                    full={true} actions={actions} />) : 'Loading posts') : null }
              </section>
            );
          });
        }
      })()
    ];
  }
}

export const CategoryList = connect(CategoryListComponent, (state) => ({
  categories: state.categories,
  content: state.content,
  posts: state.posts
}));

/**
 * Unconnected component for generating a list of categories and the number
 * of posts that has that category
 */
const CategoryCountsComponent = ({ categories, actions }) => {
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
      { Object.keys(categories).sort().map((id) => {
        let parts = id.split('/');
        const level = parts.length - 1;
        id = parts[parts.length-1];
        return (
          <li key={id} style={{ marginLeft: level * 15 }}>
            <Link to={urlJoin(config.baseUri, config.categoriesUri +
                (config.categoriesPerPage ? '' : '#') + id)}>
              {categoryLabel(id)} ({categories[id]})
            </Link>
          </li>
        )
      })}
    </ul>
  );
};

export const Categories = connect(CategoryCountsComponent, (state) => ({
  categories: state.categories
}));
