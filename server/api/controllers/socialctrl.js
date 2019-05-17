import util from 'util';
import geolib from 'geolib';
import sortJsonArray from 'sort-json-array';
import * as mod from '../models/socialmod';

// FONCTIONS

export const getUserBlockedList = async (req, res) => {
  const { user } = req;
  const blockedornot = util.promisify(mod.getUserBlockedList);
  const blockedTab = await blockedornot(user.idUser).then(datablock => datablock).catch((err) => { console.log(`[Error]: ${err}`); });
  res.status(200).json({ blockedTab });
};

export const getUserAgeDistanceScoreReport = async (req, res) => {
  const { user } = req;
  const userdata = util.promisify(mod.getUsersVal);
  const data = await userdata(user).then(datauser => datauser).catch((err) => { console.log(`[Error]: ${err}`); });

  let scoreMin = null;
  let scoreMax = null;
  let distanceMin = null;
  let distanceMax = null;
  let ageMin = null;
  let ageMax = null;
  let reportMin = null;
  let reportMax = null;

  let c = 0;

  const blockedornot = util.promisify(mod.getUserBlockedList);
  const blockedTab = await blockedornot(user.idUser).then(datablock => datablock).catch((err) => { console.log(`[Error]: ${err}`); });

  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < blockedTab.length; j += 1) {
      if (blockedTab[j].blockedUserId === data[i].idUser) {
        c = 1;
      } else if ((blockedTab[j].userId === data[i].idUser)) {
        c = 1;
      }
    }
    if (c !== 0) {
      c = 0;
      continue;
    }
    let distance = await geolib.getDistanceSimple(
      { latitude: data[i].location.latitude, longitude: data[i].location.longitude },
      { latitude: user.location.latitude, longitude: user.location.longitude }, { unit: 'm' }
    );
    distance /= 1000;
    const userAge = Math.floor((new Date() - data[i].dateOfBirth)
    / 1000 / 60 / 60 / 24 / 365);

    scoreMin = scoreMin === null ? data[i].score : scoreMin;
    scoreMax = scoreMax === null ? data[i].score : scoreMax;
    distanceMin = distanceMin === null ? distance : distanceMin;
    distanceMax = distanceMax === null ? distance : distanceMax;
    ageMin = ageMin === null ? userAge : ageMin;
    ageMax = ageMax === null ? userAge : ageMax;
    reportMin = reportMin === null ? data[i].report : reportMin;
    reportMax = reportMax === null ? data[i].report : reportMax;

    scoreMin = scoreMin > data[i].score ? data[i].score : scoreMin;
    scoreMax = scoreMax < data[i].score ? data[i].score : scoreMax;
    distanceMin = distanceMin > distance ? distance : distanceMin;
    distanceMax = distanceMax < distance ? distance : distanceMax;
    ageMin = ageMin > userAge ? userAge : ageMin;
    ageMax = ageMax < userAge ? userAge : ageMax;
    reportMin = reportMin > data[i].report ? data[i].report : reportMin;
    reportMax = reportMax < data[i].report ? data[i].report : reportMax;
  }
  res.status(200).json({ scoreMin,
    scoreMax,
    distanceMin,
    distanceMax,
    ageMin,
    ageMax,
    reportMin,
    reportMax });
};

export const getUserLiked = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }
  return mod.getUserLiked(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `${success}` }); // success = true or false
  });
};

export const getUserMatche = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }
  return mod.getUserMatche(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `${success}` }); // success = true or false
  });
};

export const getUserReported = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }
  return mod.getUserReported(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `${success}` }); // success = true or false
  });
};

export const getUserBlocked = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }
  return mod.getUserBlocked(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `${success}` }); // success = true or false
  });
};

export const like = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }

  const blockedornot = util.promisify(mod.getUserBlocked);
  const blockedvalue = await blockedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (blockedvalue === true) {
    return res.status(400).json({ error: 'you have blocked this user' });
  }

  const likedornot = util.promisify(mod.getUserLiked);
  const likevalue = await likedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (likevalue === true) {
    return res.status(400).json({ error: 'you already like this user' });
  }

  const matchedornot = util.promisify(mod.getUserMatche);
  const matchevalue = await matchedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  const matchereeci = util.promisify(mod.getUserLiked);
  const likereci = await matchereeci(id, req.user.idUser).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if ((matchevalue === false) && (likereci === true)) {
    mod.createMatche(req.user.idUser, id, (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log(`create matche ${success}`);
    });
  }

  mod.editLike(id, 1, (err, success) => {
    if (err) {
      console.log(err);
    }
    console.log(`add like ${success}`);
  });
  return mod.like(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `User ${id} liked ${success}` });
  });
};

export const unLike = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }

  const blockedornot = util.promisify(mod.getUserBlocked);
  const blockedvalue = await blockedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (blockedvalue === true) {
    return res.status(400).json({ error: 'you have blocked this user' });
  }

  const matchedornot = util.promisify(mod.getUserMatche);
  const matchevalue = await matchedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (matchevalue === true) {
    mod.delMatche(req.user.idUser, id, (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log(`remove matche ${success}`);
    });
  }


  const likedornot = util.promisify(mod.getUserLiked);
  const likevalue = await likedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (likevalue === false) {
    return res.status(400).json({ error: 'you already unlike this user' });
  }

  mod.editLike(id, Number(-1), (err, success) => {
    if (err) {
      console.log(err);
    }
    console.log(`remove like ${success}`);
  });
  return mod.unLike(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `User ${id} unliked ${success}` });
  });
};

export const reportUser = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }

  const blockedornot = util.promisify(mod.getUserBlocked);
  const blockedvalue = await blockedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (blockedvalue === true) {
    return res.status(400).json({ error: 'you have blocked this user' });
  }

  const reportornot = util.promisify(mod.getUserReported);
  const reportvalue = await reportornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (reportvalue === true) {
    return res.status(400).json({ error: 'you already report this user' });
  }

  mod.editReport(id, 1, (err, success) => {
    if (err) {
      console.log(err);
    }
    console.log(`add report ${success}`);
  });

  return mod.report(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `User ${id} report ${success}` });
  });
};

export const unReportUser = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }

  const blockedornot = util.promisify(mod.getUserBlocked);
  const blockedvalue = await blockedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (blockedvalue === true) {
    return res.status(400).json({ error: 'you have blocked this user' });
  }

  const reportornot = util.promisify(mod.getUserReported);
  const reportvalue = await reportornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (reportvalue === false) {
    return res.status(400).json({ error: 'you already unreport this user' });
  }

  mod.editReport(id, Number(-1), (err, success) => {
    if (err) {
      console.log(err);
    }
    console.log(`remove report ${success}`);
  });


  return mod.unReport(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `User ${id} unreport ${success}` });
  });
};

export const blockUser = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }
  const blockedornot = util.promisify(mod.getUserBlocked);
  const blockedvalue = await blockedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (blockedvalue === true) {
    return res.status(400).json({ error: 'you already have blocked this user' });
  }

  const matchedornot = util.promisify(mod.getUserMatche);
  const matchevalue = await matchedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (matchevalue === true) {
    mod.delMatche(req.user.idUser, id, (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log(`remove matche ${success}`);
    });
  }
  const likedornot = util.promisify(mod.getUserLiked);
  const likevalue = await likedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (likevalue === true) {
    mod.editLike(id, Number(-1), (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log(`remove like ${success}`);
    });
    mod.unLike(req.user.idUser, id, (err, success) => {
      if (err) {
        console.log({ error: err.error });
      }
      console.log({ message: `User ${id} unliked ${success}` });
    });
  }

  const reportornot = util.promisify(mod.getUserReported);
  const reportvalue = await reportornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (reportvalue === false) {
    mod.editReport(id, 1, (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log(`add report ${success}`);
    });
    mod.report(req.user.idUser, id, (err, success) => {
      if (err) {
        console.log({ error: err.error });
      }
      console.log({ message: `User ${id} report ${success}` });
    });
  }

  return mod.blockUser(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `User ${id} blocked ${success}` });
  });
};

export const unBlockUser = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const userexist = util.promisify(mod.testUserId);
  const resultexist = await userexist(id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (resultexist === false) {
    return res.status(400).json({ error: 'User dosnt exist' });
  }
  const blockedornot = util.promisify(mod.getUserBlocked);
  const blockedvalue = await blockedornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (blockedvalue === false) {
    return res.status(400).json({ error: 'you already have unblocked this user' });
  }

  const reportornot = util.promisify(mod.getUserReported);
  const reportvalue = await reportornot(req.user.idUser, id).then(data => data).catch((err) => { console.log(`[Error]: ${err}`); });

  if (reportvalue === false) {
    mod.editReport(id, -1, (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log(`add report ${success}`);
    });
    mod.unReport(req.user.idUser, id, (err, success) => {
      if (err) {
        console.log({ error: err.error });
      }
      console.log({ message: `User ${id} unreport ${success}` });
    });
  }

  return mod.unBlockUser(req.user.idUser, id, (err, success) => {
    if (err) {
      res.status(400).json({ error: err.error }); return;
    }
    res.status(200).json({ message: `User ${id} unblocked ${success}` });
  });
};

/* ---------------------------------------------------------- */
/* ---///---///---/// Debut fonction Mache \\\---\\\---\\\--- */
/* ---------------------------------------------------------- */

/*
  la fonction return un json :
    {
      users : [
        1 : { userData },
        2 : { userData },
        ...
      ],
      start: valeurDuProchainStart
    }
    si il n'y a plus d'users la fonction renvoi :
    {
      users : [],
      start: valeurDuProchainStart
    }
    les tags sont separer par une virgule tags -> test1,test2 tag,test etc...
*/

const getUserwithTags = async (user, count, start, ageMin, ageMax,
  distanceMin, distanceMax, scoreMin, scoreMax, tags, res) => {
  const tagid = [];
  const goodTagId = [];
  let newStart = start;
  const checkTags = util.promisify(mod.getTagOfUsers);
  for (let i = 0; i < tags.length; i += 1) {
    const taglist = await checkTags(user.idUser, tags[i]).then(datablock => datablock).catch((err) => { console.log(`[Error]: ${err}`); });
    if (taglist !== '') {
      for (let j = 0; j < taglist.length; j += 1) {
        tagid.push(taglist[j].userId);
      }
    }
  }
  const uniq = [...new Set(tagid)];
  let setcountid = 0;
  for (let i = 0; i < uniq.length; i += 1) {
    for (let j = 0; j < tagid.length; j += 1) {
      if (uniq[i] === tagid[j]) {
        setcountid += 1;
        if (setcountid === tags.length) { goodTagId.push(uniq[i]); }
      }
    }
    setcountid = 0;
  }
  const resultData = { users: [], newStart };

  let result = 0;
  let c = 0;
  const blockedornot = util.promisify(mod.getUserBlockedList);
  const getUserFunction = util.promisify(mod.getuserbyIdUser);
  const blockedTab = await blockedornot(user.idUser).then(datablock => datablock).catch((err) => { console.log(`[Error]: ${err}`); });

  for (newStart; newStart < goodTagId.length; newStart += 1) {

    if (result >= count) {
      break;
    }

    for (let j = 0; j < blockedTab.length; j += 1) {
      if (blockedTab[j].blockedUserId === goodTagId[newStart]) {
        c = 1;
      } else if ((blockedTab[j].userId === goodTagId[newStart])) {
        c = 1;
      }
    }
    if (c !== 0) {
      c = 0;
      continue;
    }

    const getUser = await getUserFunction(goodTagId[newStart]).then(datauser => datauser).catch((err) => { console.log(`[Error]: ${err}`); });
    if (getUser === undefined) {
      break;
    }

    let distance = await geolib.getDistanceSimple(
      { latitude: getUser.location.latitude, longitude: getUser.location.longitude },
      { latitude: user.location.latitude, longitude: user.location.longitude }, { unit: 'm' }
    );
    distance /= 1000;
    const getUserAge = Math.floor((new Date() - getUser.dateOfBirth)
                                            / 1000 / 60 / 60 / 24 / 365);
    if (getUserAge < ageMin) {
      resultData.start = newStart;
      newStart += 1;
      continue;
    }
    if (ageMax != null) {
      if (getUserAge > ageMax) {
        resultData.start = newStart;
        newStart += 1;
        continue;
      }
    }
    if (getUser.score < scoreMin) {
      resultData.start = newStart;
      newStart += 1;
      continue;
    }
    if (scoreMax != null) {
      if (getUser.score > scoreMax) {
        resultData.start = newStart;
        newStart += 1;
        continue;
      }
    }
    if (distance < distanceMin) {
      resultData.start = newStart;
      newStart += 1;
      continue;
    }
    if (distanceMax != null) {
      if (distance > distanceMax) {
        resultData.start = newStart;
        newStart += 1;
        continue;
      }
    }

    resultData.users.push(getUser);
    result += 1;
  }
  resultData.newStart = newStart;
  resultData.users = await sortJsonArray(resultData.users, 'connexionLog', 'des');
  return res.status(200).json({ resultData });
};

/* //////////////////////////////////////////////////////////////// */

const getUserNoTags = async (user, count, start, ageMin, ageMax,
  distanceMin, distanceMax, scoreMin, scoreMax, res) => {

  let result = 0;
  let c = 0;
  let newStart = start;
  const resultData = { users: [], newStart };
  const blockedornot = util.promisify(mod.getUserBlockedList);
  const blockedTab = await blockedornot(user.idUser).then(datablock => datablock).catch((err) => { console.log(`[Error]: ${err}`); });

  const getUserFct = util.promisify(mod.getUsersForMe);

  while (result < count) {
    const getUser = await getUserFct(user, scoreMin, scoreMax, 150, start).then(datauser => datauser).catch((err) => { console.log(`[Error]: ${err}`); });

    for (let i = 0; i < 150; i += 1) {
      if (result >= count) {
        break;
      }
      if (getUser[i] === undefined) {
        break;
      }
      for (let j = 0; j < blockedTab.length; j += 1) {
        if (blockedTab[j].blockedUserId === getUser[i].idUser) {
          c = 1;
        } else if ((blockedTab[j].userId === getUser[i].idUser)) {
          c = 1;
        }
      }
      if (c !== 0) {
        c = 0;
        continue;
      }
      let distance = await geolib.getDistanceSimple(
        { latitude: getUser[i].location.latitude, longitude: getUser[i].location.longitude },
        { latitude: user.location.latitude, longitude: user.location.longitude }, { unit: 'm' }
      );
      distance /= 1000;
      const getUserAge = Math.floor((new Date() - getUser[i].dateOfBirth)
                                            / 1000 / 60 / 60 / 24 / 365);
      if (getUserAge < ageMin) {
        resultData.start = newStart;
        newStart += 1;
        continue;
      }
      if (ageMax != null) {
        if (getUserAge > ageMax) {
          resultData.start = newStart;
          newStart += 1;
          continue;
        }
      }
      if (distance < distanceMin) {
        resultData.start = newStart;
        newStart += 1;
        continue;
      }
      if (distanceMax != null) {
        if (distance > distanceMax) {
          resultData.start = newStart;
          newStart += 1;
          continue;
        }
      }
      resultData.users.push(getUser[i]);
      newStart += 1;
      result += 1;
    }
    if (getUser[149] === undefined) {
      break;
    }
  }
  resultData.newStart = newStart;
  resultData.users = await sortJsonArray(resultData.users, 'connexionLog', 'des');
  return res.status(200).json({ resultData });
};

/* //////////////////////////////////////////////////////////////// */

export const getUsersForMe = async (req, res) => {

  const { user } = req;
  const count = Number(req.params.count);
  const start = Number(req.params.start);
  if (isNaN(count)) {
    return res.status(400).json({ error: 'count must be a number' });
  }
  if (isNaN(start)) {
    return res.status(400).json({ error: 'start must be a number' });
  }
  let { ageMin, ageMax, distanceMin, distanceMax,
    scoreMin, scoreMax, tags } = req.body;
  if (ageMin === undefined || ageMin === '') {
    ageMin = 0;
  }
  if (ageMax === undefined || ageMax === '') {
    ageMax = null;
  }
  if (distanceMin === undefined || distanceMin === '') {
    distanceMin = 0;
  }
  if (distanceMax === undefined || distanceMax === '') {
    distanceMax = null;
  }
  if (scoreMin === undefined || scoreMin === '') {
    scoreMin = 0;
  }
  if (scoreMax === undefined || scoreMax === '') {
    scoreMax = null;
  }


  if (tags === undefined || tags === '') {
    tags = null;
    return getUserNoTags(user, count, start, ageMin, ageMax,
      distanceMin, distanceMax, scoreMin, scoreMax, res);
  }
  tags = tags.split(',');
  return getUserwithTags(user, count, start, ageMin, ageMax,
    distanceMin, distanceMax, scoreMin, scoreMax, tags, res);

};