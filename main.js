var partnersURL = 'https://docs.google.com/spreadsheets/d/1y_FVjRDYBBpUN4Pxf5iMjlAJH4bx9qhdzPoLw9fiU0A/pubhtml';
var studentsURL = 'https://docs.google.com/spreadsheets/d/1xb2gFO1So3U1r6mYPJ28XHDw7s-M2h49kSFHzbJODMI/pubhtml';
var facultyURL = 'https://docs.google.com/spreadsheets/d/1TNppz6r-A8lC1tA5zwO_3AqRGYkNX-dgwazEIpEtudc/pubhtml';

Tabletop.init({
  key: partnersURL,
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

    var project = data[i]['Project'];
    var products = data[i]['Products'];
    var research = data[i]['Research'];
    var mission = data[i]['Mission'];
    var learn = data[i]['Learn'];

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
    var orgs = data[i]['Organization'].split(';').map(function(x) {return $.trim(x)});

    var namesFormatted = '';
    for (j in names) {
      if (namesFormatted != '') namesFormatted += ', ';
      if (emails[j]) {
        namesFormatted += '<a href="mailto:' + emails[j] + '">' + names[j] + '</a>';
      } else {
        namesFormatted += names[j];
      }
    }

    var orgsFormatted = '';
    for (j in orgs) {
      if (orgsFormatted != '') orgsFormatted += ', ';
      if (websites[j]) {
        orgsFormatted += '<a href="' + websites[j] + '">' + orgs[j] + '</a>';
      } else {
        orgsFormatted += orgs[j];
      }
    }

    $(div).append('<h1>' + team + ' Project</h1>');
    $(div).append('<div class="hr" style="background:#' + Math.random().toString(16).substr(-6) + '"></div>');
    $(div).append('<p><span>CONTACT</span><br>' + namesFormatted + '</p>');
    if (orgs[0]) {
      $(div).append('<p><span>ORGANIZATION</span><br>' + orgsFormatted + '</p>');
    }
    $(div).append('<p><span>MISSION</span><br>' + mission + '</p>');
    $(div).append('<p><span>PROJECT</span><br>' + project + '</p>');
    $(div).append('<p><span>RESEARCH</span><br>' + research + '</p>');
    $(div).append('<p><span>PRODUCTS</span><br>' + products + '</p>');
    if (learn) {
      $(div).append('<p><span>ADDITIONAL</span><br><a href="' + learn + '">Learn more</a></p>');
    }
    $(div).append('<p class="additional"></p>');
  }

  processStudentsAndFaculty('f');
}


function processStudentsAndFaculty(who) {
  Tabletop.init({
    key: who == 's' ? studentsURL : facultyURL,
    simpleSheet: true,
    callback: function(data) {

      var projects = {};

      for (i in data) {
        var row = data[i];
        var name = row['Name'];
        if ($.trim(row['Weblink']) != '') {
          var link = $.trim(row['Weblink']);
          if (link && link.indexOf('http') != 0) {
            link = 'http://' + link;
          }
          name = '<a href="' + link + '">' + name + '</a>';
        }

        var keys = Object.keys(row);

        var choices = ['1st', '2nd', '3rd', '4th', '5th'];

        for (j in keys) {
          var key = keys[j];

          choices.forEach(function(choice) {
            if (key.indexOf(choice) > -1) {
              var proj = row[key];
              if (!projects[proj]) {
                projects[proj] = {};
              }
              if (!projects[proj][choice]) {
                projects[proj][choice] = [];
              }

              projects[proj][choice].push(name);
            }
          });
        }
      }

      var projectKeys = Object.keys(projects);
      for (p in projectKeys) {
        var proj = projectKeys[p];
        var message = '';

        if (who === 's') {
          var t = projects[proj];
          var n = Object.keys(t).map(function(x) {return t[x].length;}).reduce(function(a, b) {return a+b;});
          if (n > 0) {
            message = n + ' students' + (n == 1 ? ' is' : ' are') + ' interested in this project.';
          }
        } else {
          var fellows = [];
          for (idx in choices) {
            if (projects[proj][choices[idx]]) {
              fellows = fellows.concat(projects[proj][choices[idx]]);
            }
          }

          var n = fellows.length;
          if (n > 0) {
            message = fellows.join(', ') + (n == 1 ? ' is a ' : ' are') + ' potential faculty fellow' + (n == 1 ? '' : 's') + '.<br>';
          }
        }

        $('#project-' + proj.replace(' ', '') + ' .additional').append(message);
      }

      if (who == 'f') {
        processStudentsAndFaculty('s');
      }

    }
  });
}
