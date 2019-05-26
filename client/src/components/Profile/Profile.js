import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import Modal from 'components/UI/Modal/Modal';
import { Image } from 'semantic-ui-react';
import Chip from '@material-ui/core/Chip';
import Slider from 'react-slick';
import { getAge, getLastLog } from 'shared/utility';
import './Profile.scss';

class ProfilePage extends Component {
  state = {
    reported: false,
    blocked: false,
    showBackdrop: true,
  }

  componentDidMount() {
    this.getReportStatus();
  }

  onClickHandler = () => {
    const { handleProfile } = this.props;

    this.setState({ showBackdrop: false });
    handleProfile();
  }

  getReportStatus = () => {
    const { data, token } = this.props;
    const { idUser } = data;

    axios
      .get(`social/getuserreported/${idUser}`, { headers: { Authorization: `bearer ${token}` } })
      .then((res) => {
        if (res.data.message === 'true') {
          this.setState({ reported: true });
        }
      });
    axios
      .get(`social/getuserblocked/${idUser}`, { headers: { Authorization: `bearer ${token}` } })
      .then((res) => {
        if (res.data.message === 'true') {
          this.setState({ blocked: true });
        }
      });
  }

  changeReportStatus = async () => {
    const { data, token } = this.props;
    const { reported } = this.state;

    const { idUser } = data;
    const headers = { headers: { Authorization: `bearer ${token}` } };
    await this.getReportStatus();

    if (reported) {
      // this.setState({ reported: false });
      axios
        .delete(`social/report/${idUser}`, headers)
        .then(res => this.setState({ reported: false }))
        .catch(err => console.log(err.response.data.error));
    } else {
      // this.setState({ reported: true });
      axios
        .post(`social/report/${idUser}`, null, headers)
        .then(res => this.setState({ reported: true }))
        .catch(err => console.log(err.response.data.error));
    }
  }

  changeBlockStatus = async () => {
    const { data, token } = this.props;
    const { blocked } = this.state;

    const { idUser } = data;
    const headers = { headers: { Authorization: `bearer ${token}` } };
    await this.getReportStatus();

    if (blocked) {
      // this.setState({ blocked: false });
      axios
        .delete(`social/block/${idUser}`, headers)
        .then(res => this.setState({ blocked: false }))
        .catch(err => console.log(err.response.data.error));
    } else {
      // this.setState({ blocked: true });
      axios
        .post(`social/block/${idUser}`, null, headers)
        .then(res => this.setState({ blocked: true }))
        .catch(err => console.log(err.response.data.error));
    }
  }

  render() {
    const { data, settings, meta, handleLike } = this.props;
    const { idUser,
      username,
      firstName,
      bio,
      dateOfBirth,
      photo,
      score,
      genre,
      orientation,
      connexionLog,
      location } = data;
    const { blocked, reported, showBackdrop } = this.state;

    const title = `${username.charAt(0).toUpperCase() + username.slice(1)}`;

    const { master } = photo;

    let reportStatus = 'Report';
    let blockStatus = 'Block';

    if (reported) reportStatus = 'Un-Report';
    if (blocked) blockStatus = 'Un-Block';

    return (
      <>
        <Backdrop show={showBackdrop} clicked={this.onClickHandler} />
        <Modal clicked={this.onClickHandler} title={title}>
          <section className="Profile">
            <div className="ProfilePictures">
              <Slider {...settings} className="Slider">
                <Image className="Grabber ProfilePictures" src={`data:image/png;base64,${photo[master]}`} />
                {Object.keys(photo).map(
                  (value, id) => (photo[value] && photo[value].length !== 6 ? <Image key={`${photo[id]}-${idUser}`} className="Grabber ProfilePictures" src={`data:image/png;base64,${photo[value]}`} /> : null)
                )}
              </Slider>
            </div>
            <div className="ProfileHeader">
              <div className="Status">
                <span>
                  <i className="fas fa-circle" />
                  {' '}
                  {getLastLog(connexionLog)}
                </span>
              </div>
              <span>
                <button type="button" className="Like" onClick={handleLike}>
                  {meta.likeStatus}
                </button>
              </span>
              <span onClick={this.profileHandler} role="presentation" className="Pointer">
                <p style={{ display: 'inline-block' }}>
                  {`${firstName.charAt(0).toUpperCase() + firstName.slice(1)}`}
                </p>
                <p style={{ display: 'inline-block' }}>{`, ${getAge(dateOfBirth)} years`}</p>
              </span>
            </div>
            <div className="ProfileMeta">
              <p>
                Location:
                {' '}
                <span>
                  <i className="fas fa-map-marker-alt" />
                  {` ${location.city}`}
                </span>
              </p>
              <p>
                Genre:
                {' '}
                {{
                  M: (<i className="fas fa-mars" />),
                  W: (<i className="fas fa-venus" />),
                  O: (<i className="fas fa-transgender-alt" />),
                }[genre]}
              </p>
              <p>
                Orientation:
                {' '}
                {{
                  M: (<i className="fas fa-mars" />),
                  W: (<i className="fas fa-venus" />),
                  BI: (
                    <>
                      <i className="fas fa-mars" />
                      {' '}
                      <i className="fas fa-venus" />
                    </>
                  ),
                }[orientation]}
              </p>
              <p>
                Score:
                {' '}
                <span className="Popularity">
                  <i className="fas fa-fire-alt" />
                  {score}
                </span>
              </p>
            </div>
            <div className="ProfileBio">
              <p style={{ color: 'rgba(0,0,0,.6)' }}> Biography </p>
              <p>
                {bio}
              </p>
            </div>
            <div className="ProfileTags">
              <p style={{ color: 'rgba(0,0,0,.6)' }}> Tags </p>
              <p>
                {meta.tags.map((tag, id) => (<Chip key={id} style={{ height: '14px' }} label={tag} />))}
              </p>
            </div>
            <div className="Report">
              <p style={{ marginLeft: 'auto', padding: '5px' }}>
                <span className="Pointer" onClick={this.changeBlockStatus} role="presentation">
                  <i className="fas fa-ban" />
                  <span>
                    {blockStatus}
                  </span>
                </span>
                {'   '}
                <span className="Pointer" onClick={this.changeReportStatus} role="presentation">
                  <i className="fas fa-exclamation-triangle" />
                  <span>
                    {reportStatus}
                  </span>
                </span>
              </p>
            </div>
          </section>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(ProfilePage);