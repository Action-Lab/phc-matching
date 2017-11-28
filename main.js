var facultyURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQP155lRPhtzuASD_LEXs6xW5MWBNjCqWApyokQcZ_sWoiy6aAeBoh4sXASGzBCX_LXuRhMWzg0xdi/pubhtml';

Tabletop.init({
  key: facultyURL,
  callback: processData,
  simpleSheet: true,
});

function processData(data, tabletop) {
  if (!data[0]) return;

  for (i in data) {
    if (data[i].Display !== 'y') continue;

    var team = data[i]['Title'];
    var teamKey = team.replace(' ', '');
    if (!team) continue;

    $('body').append('<div class="project-div" id="project-' + teamKey + '"></div>');
    var div = '#project-' + teamKey;

    var research = data[i]['Research'];

    // These might be multiple people
    var websites = data[i]['Website'].split(';').map(function(x) {
      x = $.trim(x);
      if (x && x.indexOf('http') != 0) {
        x = 'http://' + x;
      }
      return $.trim(x)
    });
    var emails = data[i]['Email'].split(';').map(function(x) {return $.trim(x)});
    var names = data[i]['Name'].split(';').map(function(x) {return $.trim(x)});

    var namesFormatted = '';
    for (j in names) {
      if (namesFormatted != '') namesFormatted += ', ';
      if (emails[j]) {
        namesFormatted += '<a href="mailto:' + emails[j] + '">' + names[j] + '</a>';
      } else {
        namesFormatted += names[j];
      }
    }

    $(div).append('<h1>' + team + ' Project</h1>');
    $(div).append('<div class="hr" style="background:#' + Math.random().toString(16).substr(-6) + '"></div>');
    $(div).append('<p><span>CONTACT</span><br>' + namesFormatted + '</p>');
    $(div).append('<p><span>RESEARCH</span><br>' + research + '</p>');
    $(div).append('<p class="additional"></p>');
  }


}

