import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { Carousel as AntCarousel } from 'antd';
import { Query } from 'react-apollo';

// Components
import PieChart from './charts/PieChart';
import PartyChart from './charts/PartyChart';
import BarChart from './charts/BarChart';
import ResultNumbers from './ResultNumbers';
import PieChartCanceled from '../../../List/Teaser/PieChartCanceled';

// GraphQL
import COMMUNITY_VOTES from 'GraphQl/queries/communityVotes';

const Wrapper = styled.div`
  justify-content: center;
  display: flex;
  max-width: 100vw;
  justify-content: space-around;

  @media (min-width: ${({ theme }) => theme.responsive.mobileWidth}) {
    & > *:first-of-type {
      padding-right: 15px;
    }

    & > *:last-of-type {
      padding-left: 15px;
    }
  }
`;

const GovernmentCharts = styled.div`
  width: 50%;
  max-width: 400px;
`;

const DecisionTextWrapper = styled.div`
  padding-top: ${({ theme }) => theme.space(2)}px;
  display: flex;
`;

const DecisionTextHeadline = styled.h4`
  padding-right: ${({ theme }) => theme.space(2)}px;
`;

const DecisionText = styled.p`
  flex: 1;
`;

const Chart = styled.div``;

const ChartTitle = styled.div`
  font-weight: bold;
  text-align: center;
`;

const ChartDescription = styled.div`
  text-align: center;
  padding-bottom: 10px;
`;

const RepresentativeText = styled.div`
  color: rgb(142, 142, 147);
  text-align: center;
  font-size: 10px;
  padding-top: 10px;
  font-style: italic;
`;

const Carousel = styled(AntCarousel)``;

const VoteResultsPanel = ({ voteResults, procedure, currentStatus, isCanceled }) => {
  const votes = voteResults.yes + voteResults.no + voteResults.notVoted + voteResults.abstination;
  let voteCount = voteResults.namedVote ? `${votes} Abgeordnete` : '6 Fraktionen';

  if (isCanceled) voteCount = currentStatus;
  return (
    <Wrapper>
      <GovernmentCharts>
        <ChartTitle>Bundestag</ChartTitle>
        <ChartDescription>{voteCount}</ChartDescription>
        {!isCanceled ? (
          <>
            <Carousel arrows>
              <Chart style={{ paddingBottom: '30px' }}>
                <PieChart
                  data={_.map(
                    voteResults,
                    (value, label) =>
                      label !== '__typename' && typeof value === 'number'
                        ? {
                            value,
                            label,
                            fractions: voteResults.namedVote
                              ? null
                              : voteResults.partyVotes.filter(
                                  ({ main }) => label === main.toLowerCase(),
                                ).length,
                            percentage: Math.round((value / votes) * 100),
                          }
                        : false,
                  ).filter(e => e)}
                  colorScale={['#99C93E', '#4CB0D8', '#D43194', '#B1B3B4']}
                  label={voteResults.namedVote ? 'Abgeordnete' : 'Fraktionen'}
                  voteResults={voteResults}
                />
              </Chart>
              <Chart>
                <PartyChart
                  key="partyChart"
                  data={_.map(voteResults.partyVotes, partyVotes => ({
                    value: partyVotes.deviants,
                    label: partyVotes.party,
                  }))}
                  colorScale={['#99C93E', '#4CB0D8', '#D43194', '#B1B3B4']}
                  label="Abgeordnete"
                  voteResults={voteResults}
                />
              </Chart>
              <BarChart
                key="barChart"
                data={_.map(voteResults.partyVotes, partyVotes => ({
                  value: partyVotes.deviants,
                  label: partyVotes.party,
                }))}
                colorScale={['#99C93E', '#4CB0D8', '#D43194', '#B1B3B4']}
                label="Abgeordnete"
                voteResults={voteResults}
              />
            </Carousel>
            <ResultNumbers
              voteResults={voteResults}
              colorScale={['#99C93E', '#4CB0D8', '#D43194', '#B1B3B4']}
              data={_.map(voteResults.partyVotes, partyVotes => ({
                value: partyVotes.deviants,
                label: partyVotes.party,
              }))}
            />
            <RepresentativeText>
              {voteResults.namedVote ? 'Namentliche Abstimmung' : 'Nicht-Namentliche Abstimmung'}
            </RepresentativeText>
            {voteResults.decisionText && (
              <DecisionTextWrapper>
                <DecisionTextHeadline>Beschlusstext:</DecisionTextHeadline>
                <DecisionText>{voteResults.decisionText}</DecisionText>
              </DecisionTextWrapper>
            )}
          </>
        ) : (
          <PieChartCanceled colorScale={['#B1B3B4']} label="Zurückgezogen" showNumbers={false} />
        )}
      </GovernmentCharts>
      <GovernmentCharts>
        <Chart>
          <Query
            query={COMMUNITY_VOTES}
            variables={{
              procedure,
            }}
          >
            {({ data }) => {
              if (!data.communityVotes) return <div />;
              const communityVoteCount =
                data.communityVotes.yes + data.communityVotes.abstination + data.communityVotes.no;

              return (
                <>
                  <ChartTitle>Community</ChartTitle>
                  <ChartDescription>{communityVoteCount} Abstimmende</ChartDescription>
                  <PieChart
                    data={_.map(
                      data.communityVotes,
                      (value, label) =>
                        label !== '__typename' && typeof value === 'number'
                          ? {
                              value,
                              label,
                              fractions: null,
                              percentage: Math.round((value / communityVoteCount) * 100),
                            }
                          : false,
                    ).filter(e => e)}
                    colorScale={['#15C063', '#2C82E4', '#EC3E31']}
                    label={'Abstimmende'}
                  />
                  <ResultNumbers
                    style={{ paddingTop: '37px' }}
                    colorScale={['#15C063', '#2C82E4', '#EC3E31']}
                    voteResults={{ namedVote: true }}
                    data={[{ value: data.communityVotes }]}
                  />
                  <RepresentativeText>
                    Dieses Ergebnis wurde nicht auf seine Repräsentativität überprüft.
                  </RepresentativeText>
                </>
              );
            }}
          </Query>
        </Chart>
      </GovernmentCharts>
    </Wrapper>
  );
};

VoteResultsPanel.propTypes = {
  voteResults: PropTypes.shape().isRequired,
  procedure: PropTypes.string,
  currentStatus: PropTypes.string,
  isCanceled: PropTypes.bool,
};

export default VoteResultsPanel;
