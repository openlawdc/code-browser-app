d3.json('index.json', function(err, index) {

    // Build initial title listing
    var titles = d3.select('#titles')
        .selectAll('li.title')
        .data(index.titles);

    var li = titles
        .enter()
        .append('li')
        .attr('class', 'title')
        .on('click', clickTitle)
        .append('div')
        .attr('class', 'clearfix');

    li.append('span')
        .attr('class', 'number')
        .text(function(d) { return d[0]; });

    li.append('span')
        .attr('class', 'name')
        .text(function(d) { return d[1]; });


    function switchPanes(from, to) {
        var w = window.innerWidth;
        d3.select(to)
            .style('display', 'block')
            .style('left', w + 'px');

        d3.select(from)
            .style('left', 0)
            .transition()
            .duration(500)
            .style('left', -w + 'px')
            .each('end', function() {
                d3.select(this).style('display', 'none');
            });

        d3.select(to).transition()
            .duration(500)
            .style('left', '0px');
    }

    function clickTitle(d) {
        sectionsFor(d);
        switchPanes('#titles-pane', '#sections-pane');
    }

    function doSection(d) {
        d3.json('sections/' + d[0] + '.json', function(err, section) {
            switchPanes('#sections-pane', '#content-pane');
            var s = d3.select('#section');

            var content = s.selectAll('div.content')
                .data([section], function(d) { return JSON.stringify(d); });

            content.exit().remove();

            var div = content.enter()
                .append('div')
                .attr('class', 'content');

            div.append('h1')
                .attr('class', 'pad1')
                .text(function(d) {
                    return d.heading.catch_text;
                });

            if (section.text) {
                div.append('div')
                    .attr('class', 'pad1')
                    .selectAll('p')
                    .data(function(d) {
                        return section.text.split(/\n+/);
                    })
                    .enter()
                    .append('p')
                    .text(function(d) {
                        return d;
                    });
            }

            var sections = div.append('div')
                .attr('class', 'pad1')
                .selectAll('section')
                .data(section.sections, function(d) {
                    return d.prefix + d.text;
                });

            var sectionelem = sections.enter()
                .append('section')
                .attr('class', function(d) {
                    var c = '';
                    if (d.prefix.match(/([a-z])/)) c = 'section-1';
                    else if (d.prefix.match(/([0-9])/)) c = 'section-2';
                    else if (d.prefix.match(/([A-Z])/)) c = 'section-3';
                    return c;
                });
            sections.exit().remove();

            var section_p = sectionelem.append('p');

            section_p.append('span')
                .attr('class', 'section-prefix')
                .text(function(d) {
                    return d.prefix;
                });

            section_p.append('span')
                .text(function(d) {
                    return d.text;
                });

            if (section.credits) {
                var credits = div.append('div')
                    .attr('class', 'pad1 limited-text');
                credits.append('h4')
                    .text('Credits');
                credits.append('p')
                    .text(function(d) {
                        return d.credits;
                    });
            }

            if (section.historical) {
                var history = div.append('div')
                    .attr('class', 'pad1 limited-text');
                history.append('h4')
                    .text('Historical');
                history.append('p')
                    .text(function(d) {
                        return d.historical;
                    });
            }
        });
    }

    function doesNotApply(d) {
        return d[1].match(/\[(Repealed|Omitted|Expired)\]/g);
    }

    function sectionsFor(title) {

        function clickSection(d) {
            doSection(d);
        }

        // build section list
        var sections = d3.select('#sections')
            .selectAll('li.section')
            .data(index.sections.filter(function(s) {
                return s[0].match(/(\d+)\-/)[1] == title[0];
            }), function(d) {
                return d[0];
            });

        sections.exit().remove();

        var li = sections
            .enter()
            .append('li')
            .attr('class', 'section')
            .classed('repealed', doesNotApply)
            .on('click', clickSection);

        li.append('span')
            .attr('class', 'section-number')
            .text(function(d) { return d[0]; });

        li.append('span')
            .attr('class', 'section-name')
            .text(function(d) { return d[1]; });

        d3.select('.sections-container')
            .property('scrollTop', 0);
    }
});
