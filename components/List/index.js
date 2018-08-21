import { Component } from 'react';
import { Row, Col, Tag, Icon, Select, Spin } from 'antd';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import styled from 'styled-components';

import Dev from 'Components/shared/Dev';
import Teaser from './Teaser';

// GraphQL
import PROCEDURES from 'GraphQl/queries/procedures';
const PAGE_SIZE = 15;

const Option = Select.Option;

const Section = styled.section`
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  padding-left: ${({ theme }) => theme.space * 3}px;
  padding-right: ${({ theme }) => theme.space * 3}px;
  padding-top: ${({ theme }) => theme.space * 2}px;
  padding-bottom: ${({ theme }) => theme.space * 4}px;
`;

class List extends Component {
  state = {
    hasMore: true,
  };

  loadMore = ({ fetchMore }) => page => {
    fetchMore({
      variables: {
        offset: PAGE_SIZE * page,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          this.setState({ hasMore: false });
          return prev;
        }
        return Object.assign({}, prev, {
          procedures: [...prev.procedures, ...fetchMoreResult.procedures],
        });
      },
    });
  };

  render() {
    return (
      <Section>
        <Dev>
          <Row>
            <Col xs={24} sm={24} lg={6}>
              <Tag>
                <Icon type="info" />
                ##in Abstimung
              </Tag>
            </Col>
            <Col xs={24} sm={24} lg={12} />
            <Col xs={24} sm={24} lg={6}>
              <Icon type="arrow-down" />
              <Select
                defaultValue="##Nach Restzeit sortieren"
                onChange={value => console.log(value)}
              >
                <Option value="timeleft">##Nach Restzeit sortieren</Option>
                <Option value="activity">##Nach Aktivitäten sortieren</Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Query query={PROCEDURES} variables={{ type: 'VOTING', pageSize: PAGE_SIZE }}>
              {({ loading, error, data: { procedures }, fetchMore }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;
                return (
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore({ fetchMore })}
                    hasMore={this.state.hasMore}
                    loader={<Spin size="large" key="spinner" />}
                  >
                    {procedures.map(({ procedureId, ...rest }) => (
                      <Teaser key={procedureId} procedureId={procedureId} {...rest} />
                    ))}
                  </InfiniteScroll>
                );
              }}
            </Query>
          </Row>
        </Dev>
      </Section>
    );
  }
}

export default List;
