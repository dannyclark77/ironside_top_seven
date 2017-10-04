'use strict'

const showRosterTemplate = require('../templates/roster-listing.handlebars')
const showTopSevenTemplate = require('../templates/top-seven.handlebars')
const store = require('../store')
const api = require('./api')

const topSeven = []

const getPlayersSuccess = function (data) {
  store.players = data.players
  const filteredPlayers = store.players.filter(function (obj) {
    return obj.year === store.year
  })
  const showRosterHtml = showRosterTemplate({ players: filteredPlayers })
  $('.roster').empty()
  $('.roster').append(showRosterHtml)
  clickTeam()
  store.players = null
  $('#roster').text('Ironside Roster ' + store.year)
  seasonResults(store.year)
}

const getPlayersFailure = function () {
  $('.roster').text('An error occurred accessing this roster. Please try again.')
}

const clickTeam = function () {
  $('.roster').off().on('click', 'ul', function (event) {
    event.preventDefault()
    // if ($.grep(topSeven, function (obj) { return obj.player.name }) === $(this).text()) {
    //   console.log('Please choose another player')
    // } else {
    api.postTeamRoster($(this).data('id'))
      .then(postTeamSuccess)
      .catch(postTeamFailure)
    // }
  })
}

const postTeamSuccess = function (data) {
  topSeven.push(data.team)
  displayTopSeven()
}

const postTeamFailure = function () {
  $('.topseven').text('This player has already been selected. Please choose another player.')
}

const signInTopSevenSuccess = function (data) {
  data.teams.forEach(function (data) {
    if (data.user.id === store.user.id) {
      topSeven.push(data)
    }
  })
  if (topSeven.length > 7) {
    const result = $.grep(data.teams, function (element) {
      return element.user.id === store.user.id
    })
    onDeleteEight(result[0].id)
  }
  displayTopSeven()
}

const signInTopSevenFailure = function () {
  $('.topseven').text('An error occurred accessing your top seven picks.')
}

const displayTopSeven = function () {
  if (topSeven.length > 7) {
    const slicedTopSeven = topSeven.slice(-7)
    const showTopSevenHtml = showTopSevenTemplate({ data: slicedTopSeven })
    $('.topseven').text('')
    $('.topseven').append(showTopSevenHtml)
  } else {
    const showTopSevenHtml = showTopSevenTemplate({ data: topSeven })
    $('.topseven').text('')
    $('.topseven').append(showTopSevenHtml)
  }
}

const onDeleteEight = function (data) {
  api.deleteEight(data)
    .then(deletePlayerSuccess)
    .catch(deletePlayerFailure)
}

const deletePlayerSuccess = function (data) {
  displayTopSeven()
}

const deletePlayerFailure = function () {
  $('.topseven').text('An error occurred deleting this player. Please try again.')
}

const patchTeamSuccess = function () {
  $('.patch-selection').append('Player successfully updated')
  topSeven.length = 0
  api.signInTopSevenRoster()
    .then(signInTopSevenSuccess)
}

const patchTeamFailure = function (error) {
  console.log(error)
}

const seasonResults = function (data) {
  if (data === 2008) {
    $('#results').text('2008 Season: Record: 42-5, Finish: 2nd')
  } else if (data === 2009) {
    $('#results').text('2009 Season: Record: 42-6, Finish: 3rd')
  } else if (data === 2010) {
    $('#results').text('2010 Season: Record: 52-1, Finish: 2nd')
  } else if (data === 2011) {
    $('#results').text('2011 Season: Record: 0-0, Finish: 2nd')
  } else if (data === 2012) {
    $('#results').text('2012 Season: Record: 0-0, Finish: 3rd')
  } else if (data === 2013) {
    $('#results').text('2013 Season: Record: 0-0, Finish: 3rd')
  } else if (data === 2014) {
    $('#results').text('2014 Season: Record: 0-0, Finish: 2nd')
  } else if (data === 2015) {
    $('#results').text('2015 Season: Record: 17-11, Finish: 3rd')
  } else if (data === 2016) {
    $('#results').text('2016 Season: Record: 26-2, Finish: 1st')
  } else {
    $('#results').text('2017 Season: Record: 22-8, Finish: TBD')
  }
}

module.exports = {
  getPlayersSuccess,
  getPlayersFailure,
  signInTopSevenSuccess,
  signInTopSevenFailure,
  topSeven,
  deletePlayerSuccess,
  deletePlayerFailure,
  patchTeamSuccess,
  patchTeamFailure
}
