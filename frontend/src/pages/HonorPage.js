import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { historyAsync, rankingAsync } from "../store/accountSaga";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { fetchOtherUser } from "../store/account";
import Modal from "../components/Modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { nodeName } from "jquery";
import CustomTable from "../components/CustomTable";
import click from "../media/images/click.png";
import clickhover from "../media/images/clickhover.png";
import SellImage from "../media/images/sell.png"
import BuyImage from "../media/images/buy.png"

// import Carousel from "../components/Carousel";

const HonorPageBlock = styled.div`
  display: flex;
  /* overflow: hidden; */
`;

const NavBlock = styled.div`
  /* border: solid yellow 3px; */
  width: 6vw;
  height: 100vh;
  display: flex;
`;

const HonorBlock = styled.div`
  background-color: #f3f3f3;
  /* border: solid black 3px; */
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const RankingCard = styled.div`
  margin-top: 3vh;
  width: 20vw;
  height: auto;
  /* border: 2px solid green; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RankingCardItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 25vw;
  height: 35vh;
  border: 3px solid #98a8ea;
  border-radius: 10px;
  margin: 3vmax;
  background-color: white;
  :hover {
    border-color: #061e8c;
    transform: scale(1.04);
    transition: 0.4s ease-in-out;
  }
  cursor: pointer;
  .RankItem {
    padding-left: 25px;
  }
`;
const RankingProfile = styled.div`
  display: flex;
  justify-content: center;
  width: 10vw;
  height: 10vh;
  position: absolute;
  top: -6vh;
  left: 7vw;
  /* border: 2px solid black; */
`;
const RankingTable = styled.div`
  /* border: 2px solid red; */
  margin-left: 3vmax;
  margin-right: 3vmax;
  margin-top: -2vh;
  /* width: auto; */
  height: 31vh;
  justify-content: center;
  text-align: center;
  overflow: scroll;
  overflow-x: scroll;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 5px;
    background-color: #f3f3f3;
  }
  &::-webkit-scrollbar-thumb {
    width: 10px;
    border-radius: 5px;
    background-color: #697ed9;
  }
  thead {
    background-color: #aabfea;
    td {
      border: 3px solid #aabfea;
      border-radius: 5px;
      font-size: 30px;
      font: solid;
    }
  }

  tbody {
    td {
      /* border: 1px solid black;
      border-radius: 5px; */
      background-color: white;
      font-size: 25px;
    }
  }
  .RankIdx {
    width: 15vw;
  }
  .RankUser {
    width: 20vw;
  }
  .RankBalance {
    width: 25vw;
  }
  .RankPercent {
    width: 25vw;
  }
  .RankHistory {
    width: 10vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const SearchButton = styled.div`
  width: 4.5vmin;
  height: 4.5vmin;
  cursor: pointer;
  :hover {
    background: url(${clickhover}) center no-repeat;
    background-size: 4.5vmin 4.5vmin;
    transform: scale(1.1);
  }

  background: url(${click}) center no-repeat;
  background-size: 4.5vmin 4.5vmin;
`;
const RankingModalTable = styled.div`
  width: 40vw;
  height: 34.9vh;
  justify-content: center;
  text-align: center;
  overflow: auto;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 5px;
    background-color: white;
  }
  &::-webkit-scrollbar-thumb {
    width: 10px;
    border-radius: 5px;
    background-color: #697ed9;
  }
  thead {
    background-color: #aabfea;
    th {
      border: 3px solid #aabfea;
      border-radius: 5px;
      font-size: 18px;
      font: solid;
    }
  }

  tbody {
    td {
      /* border: 1px solid black;
      border-radius: 5px; */
      font-size: 15px;
    }
  }
  .HistoryDay {
    width: 30vw;
  }
  .HistoryCoin {
    width: 20vw;
  }
  .HistoryAmount {
    width: 5vw;
  }
  .HistoryPrice {
    width: 10vw;
  }
  .HistoryType {
    width: 10vw;
  }
`;
const ProfileBlock = styled.div`
  /* background-color: #F3F3F3; */
  /* border: solid green 3px; */
  width: 91vw;
  height: 10vh;
  /* margin-left: 1vw;
  margin-top: 1vw; */
  display: flex;
  flex-direction: row;

  h1 {
    /* border: solid black 3px; */
  }
`;
// ????????? ???????????????. ???????????? ?????? ???????????????
const GreetingMsg = styled.div`
  width: 50vw;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 4vmin;
  font-weight: bold;
  padding: 0.1vh 1vw;
`;
const RankAlram = styled.div`
  width: 50vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5vmin;
`;
const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  button {
    width: 5vw;
    height: 5vh;
    border-radius: 5px;
    font-family: "Jua", sans-serif;
    font-size: 25px;
    margin: 2vh;
    padding: 0;
    :hover {
      transform: scale(1.1);
    }
  }
`;

const RankMsg = styled.div`
  width: 20vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vmin;
`;

const BuyImg = styled.div`
  /* background: url(${BuyImage}) center no-repeat; */
  width: 2.5vw;
  height: 1.5vh;
  /* background-size: 2.5vw 1.5vh; */
  color: blue;
  margin-left: 2.2vw;
`

const SellImg = styled.div`
  /* background: url(${SellImage}) center no-repeat; */
  width: 2.5vw;
  height: 1.5vh;
  /* background-size: 2.5vw 1.5vh;
   */
  color: red;
  margin-left: 2.4vw;
`

function Honor() {
  useEffect(() => {
    dispatch(rankingAsync());
  }, []);
  const dispatch = useDispatch();
  const rankinglist = useSelector((state) => state.account.rankinglist);
  // const otheruser = useSelector((state) => state.account.otheruser);
  const historylist = useSelector((state) => state.account.historylist)
  const user = JSON.parse(useSelector((state) => state.account.user));
  // function selectUser(data) {
  //   dispatch(fetchOtherUser(data));
  //   dispatch(historyAsync(data.user.userId));
  //   // dispatch(fetchOtherUserAsync(userId));
  // }
  const [isOpenModal, setOpenModal] = useState(false);
  const [userInformation, setUserInformation] = useState();
  const onClickToggleModal = useCallback(
    (data) => {
      setOpenModal(!isOpenModal);
      setUserInformation(data);
      dispatch(historyAsync(data.user.userId));
      console.log(data);
      console.log(data.user.userId);
    },
    [isOpenModal]
  );
  const settings = {
    arrows: false,
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    appendDots: dots => (
      <div
        style={{
          borderRadius: "10px",
          padding: "0px",
          marginBottom: "4vh"
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };
  const customcolumns = useMemo(
    () => [
      {
        name: "user.userId", //simple recommended way to define a column
        header: "?????????",
        // enableColumnFilter: false,
        // enableSorting: false,
        // muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
      },
      {
        name: "user.balance", //simple recommended way to define a column
        header: "??????",
        // enableColumnFilter: false,
        // enableSorting: false,
        // Header: <span style={{ color: 'red' }}>??????</span>, //optional custom markup
      },
      {
        name: "percent", //simple recommended way to define a column
        header: "?????????",
        // enableColumnFilter: false,
        // enableSorting: false,
      },
    ],
    []
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: "user.userId", //simple recommended way to define a column
        header: "?????????",
        // enableColumnFilter: false,
        // enableSorting: false,
        // muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
      },
      {
        accessorKey: "user.balance", //simple recommended way to define a column
        header: "??????",
        // enableColumnFilter: false,
        // enableSorting: false,
        // Header: <span style={{ color: 'red' }}>??????</span>, //optional custom markup
      },
      {
        accessorKey: "percent", //simple recommended way to define a column
        header: "?????????",
        // enableColumnFilter: false,
        // enableSorting: false,
      },
    ],
    []
  );
  return (
    <>
      <HonorPageBlock>
        <NavBlock>
          <Navbar></Navbar>
        </NavBlock>
        <HonorBlock>
          <ProfileBlock>
            <GreetingMsg>????????? ???????????????. ???????????? ?????? ???????????????</GreetingMsg>
            <RankAlram>
              {rankinglist.map(
                (data, idx) =>
                  data.user.userId === user.userId && (
                    <RankMsg>
                      {user.userId}?????? {idx + 1} ????????????.
                    </RankMsg>
                  )
              )}
            </RankAlram>
          </ProfileBlock>
          {rankinglist && (
            <div className="carousel">
              <Slider {...settings}>
                {rankinglist.slice(0, 6).map((data, idx) => (
                  <RankingCard onClick={() => onClickToggleModal(data)}>
                    <RankingCardItem>
                      <RankingProfile>
                        <img
                          src={`${process.env.PUBLIC_URL}/profile/profile${data.user.imagePath}.png`}
                          alt={`????????? ?????????${data.user.imagePath}`}
                          width={100}
                          height={100}
                        />
                      </RankingProfile>
                      <div>
                        <h1 className="RankItem">{idx + 1} ???</h1>
                        <h1 className="RankItem" style={{fontSize: '35px', color:"#061e8c"}}>{data.user.userId}</h1>
                        <h2 className="RankItem" style={{fontWeight: 'normal'}}>????????? : {data.percent.toFixed(2)}%</h2>
                        <h2 className="RankItem" style={{fontWeight: 'normal'}}>
                          ?????????????????? : {data.user.investStartTime.substring(0, 10)} <></>
                          {/* {data.user.investStartTime.substring(11, 16)} */}
                        </h2>
                      </div>
                    </RankingCardItem>
                  </RankingCard>
                ))}
              </Slider>
            </div>
          )}
          {isOpenModal && (
            <Modal onClickToggleModal={onClickToggleModal}>
              <h1>{userInformation.user.userId} </h1>
              <h1>
                <img
                  src={`${process.env.PUBLIC_URL}/profile/profile${userInformation.user.imagePath}.png`}
                  alt={`????????? ?????????${userInformation.user.imagePath}`}
                  width={64}
                  height={64}
                />
              </h1>
              <h2>{userInformation.user.userId}?????? ?????????????????????</h2>
              <RankingModalTable>
                <table>
                  <thead>
                    <tr>
                      <th className="HistoryDay">?????? ??????</th>
                      <th className="HistoryCoin">?????? ??????</th>
                      <th className="HistoryAmount">??????</th>
                      <th className="HistoryPrice">??????</th>
                      <th className="HistoryType">??????</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historylist.map((history) => (
                      <tr key={history.historyTime}>
                        <td className="HistoryDay">
                          {history.historyTime.substring(0, 10)} <></>
                          {history.historyTime.substring(11, 19)}
                        </td>
                        <td className="HistoryCoin">{history.historyCoinName}</td>
                        <td className="HistoryAmount">{history.historyCoinAmount}</td>
                        <td className="HistoryPrice">
                          {history.historyCoinPrice.toLocaleString("ko-KR")}
                        </td>
                        <td className="HistoryType">
                          {history.historyType === 'BUY' ? 
                            <><BuyImg>BUY</BuyImg></>
                          : <><SellImg>SELL</SellImg></>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </RankingModalTable>
              <ModalButton>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickToggleModal) {
                      onClickToggleModal();
                    }
                  }}
                >
                  ??????
                </button>
              </ModalButton>
            </Modal>
          )}
          <br />
          <RankingTable>
            <table>
              <thead>
                <tr>
                  <td className="RankIdx">??????</td>
                  <td className="RankUser">?????????</td>
                  <td className="RankBalance">??????</td>
                  <td className="RankPercent">?????????</td>
                  <td className="RankHistory">????????????</td>
                </tr>
              </thead>
              <tbody>
                {rankinglist.map((rank, idx) => (
                  <tr key={rank.user.userId}>
                    <td className="RankIdx">{idx + 1} ???</td>
                    <td className="RankUser">{rank.user.userId}</td>
                    <td className="RankBalance">{rank.expectedBalance.toLocaleString("ko-KR")}</td>
                    {/* <td className="RankPercent">{rank.percent}%</td> */}
                    <td className="RankPercent">{rank.percent.toFixed(2)}%</td>
                    <td className="RankHistory">
                      <SearchButton onClick={() => onClickToggleModal(rank)}></SearchButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RankingTable>
          {/* {rankinglist && <CustomTable data={rankinglist} columns={customcolumns} />} */}
        </HonorBlock>
      </HonorPageBlock>
    </>
  );
}
export default Honor;
