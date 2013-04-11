d3.json('index.json', function(err, index) {

    // Build initial title listing
    var titles = d3.select('#titles')
        .selectAll('li.title')
        .data(index.titles);

    var titles_li = titles
        .enter()
        .append('li')
        .attr('class', 'title')
        .on('click.in', clickTitle);

    var titles_div = titles_li.append('div')
        .attr('class', 'clearfix');

    titles_div.append('span')
        .attr('class', 'number')
        .text(function(d) { return d[0]; });

    titles_div.append('span')
        .attr('class', 'name')
        .text(function(d) { return d[1]; });

    function clickTitle(d) {
        var t = this;

        document.body.scrollTop = 0;

        titles_li
            .filter(function(f) { return d == f; })
            .classed('active', true)
            .on('click.in', null)
            .on('click.out', function(d) {
                clearSections();
                clearSection();
                titles_li
                    .classed('active', false)
                    .style('display', 'block')
                    .style('height', 'auto')
                    .on('click.out', null)
                    .on('click.in', clickTitle);
            });

        titles_li.transition()
            .filter(function(f) { return d != f; })
            .duration(200)
            .style('height', '0px')
            .each('end', function(_, i) {
                if (i === 0) sectionsFor(d);
                d3.select(this).style('display', 'none');
            });
    }

    function clearSections() {
        d3.select('#sections')
            .selectAll('li.section')
            .data([])
            .exit()
            .remove();
    }

    function sectionsFor(title) {

        function clickSection(d) {
            var t = this;

            sections_li
                .filter(function(f) { return d == f; })
                .classed('active', true)
                .on('click.in', null)
                .on('click.off', function() {
                    clearSection();
                    sections_li
                        .classed('active', false)
                        .style('display', 'block')
                        .style('height', 'auto')
                        .on('click.out', null)
                        .on('click.in', clickSection);
                });

            sections_li.transition()
                .filter(function(f) { return d != f; })
                .duration(200)
                .style('height', '0px')
                .each('end', function(_, i) {
                    if (i === 0) doSection(d);
                    d3.select(this).style('display', 'none');
                });
        }

        var thisTitle = index.sections.filter(function(s) {
            return s[0].match(/(\d+)\-/)[1] == title[0];
        });

        // build section list
        var sections = d3.select('#sections')
            .selectAll('li.section')
            .data(thisTitle, function(d) { return d[0]; });

        sections.exit().remove();

        var sections_li = sections
            .enter()
            .append('li')
            .attr('class', 'section')
            .classed('repealed', doesNotApply)
            .style('opacity', 0)
            .on('click.in', clickSection);

        var div = sections_li.append('div');

        div.append('span')
            .attr('class', 'section-number')
            .text(function(d) { return d[0]; });

        div.append('span')
            .attr('class', 'section-name')
            .text(function(d) { return d[1]; });

        sections_li
            .transition()
            .style('opacity', 1);
    }

    function clearSection(d) {
        var s = d3.select('#section');
        var content = s.selectAll('div.content')
            .data([], function(d) { return JSON.stringify(d); })
            .exit()
            .remove();
    }

    function doSection(d) {
        d3.json('sections/' + d[0] + '.json', function(err, section) {
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
                    .text(String);
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

});
