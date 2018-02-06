/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 22/08/2017
 * Time: 11:17
 * To change this template use File | Settings | File Templates.
 */
function generate_sankey_JSON(json) {
    var ortho = json.orthology;
    var json_key = Object.keys(ortho);
    var orthologs = [];
    var species = [];
    var types = [];
    var nodes = [];
    var links = [];
    var type_size = {}

    nodes.push({
        "node": 0,
        "type": "orthologs",
        "name": "reference",
        "value": 2
    })

    for (var i = 0; i < json_key.length; i++) {
        orthologs.push({
            id: ortho[json_key[i]].target.id,
            species: ortho[json_key[i]].target.species,
            type: ortho[json_key[i]].type
        });
        if (species.indexOf(ortho[json_key[i]].target.species) < 0) {
            species.push(ortho[json_key[i]].target.species);
        }
        if (types.indexOf(ortho[json_key[i]].type) < 0) {
            types.push(ortho[json_key[i]].type);
            type_size[ortho[json_key[i]].type] = 1;
        } else {
            type_size[ortho[json_key[i]].type] = type_size[ortho[json_key[i]].type] + 1;
        }
    }

    var node = 1

    for (var i = 0; i < types.length; i++, node++) {
        nodes.push({
            "node": node,
            "type": "orthology",
            "name": types[i],
            "value": orthologs.length
        })
    }

    for (var i = 0; i < orthologs.length; i++, node++) {
        nodes.push({
            "node": node,
            "type": ortho[json_key[i]].type,
            "name": orthologs[i].id,
            "species": species.indexOf(orthologs[i].species),
            "speciesName": orthologs[i].species
        })

    }
    // for (var i = 0; i < species.length; i++, node++) {
    //     nodes.push({
    //         "node": node,
    //         "type": "species",
    //         "name": species[i]
    //     })
    // }


    var item;
    var first = [];
    for (var i = 0; i < types.length; i++) {

        var source = 0;

        var target = nodes.find(item => item.name == types[i]
    )

        value = 2
        if (i % 2 > 0) {
            links.push({
                "source": target.node,
                "target": source,
                "value": type_size[target.name]
            })
            first.push(types[i])
        } else {
            links.push({
                "source": source,
                "target": target.node,
                "value": type_size[target.name]
            })
        }
    }

    for (var i = 0; i < json_key.length; i++) {
        var source = nodes.find(item => item.name == ortho[json_key[i]].type
    )
        var target = nodes.find(item => item.name == ortho[json_key[i]].target.id
    )

        if (first.indexOf(ortho[json_key[i]].type) >= 0) {
            links.push({
                "source": target.node,
                "target": source.node,
                "value": 1
            })
        } else {
            links.push({
                "source": source.node,
                "target": target.node,
                "value": 1
            })
        }

    }

    // for (var i = 0; i < json_key.length; i++) {
    //     var source = nodes.find(item => item.name == ortho[json_key[i]].target.id)
    //     var target = nodes.find(item => item.name == ortho[json_key[i]].target.species
    // )
    //     links.push({
    //         "source": source.node,
    //         "target": target.node,
    //         "value": 2
    //     })
    // }

    var sankey_json = {
        "nodes": nodes,
        "links": links
    }
    setSankeyExport();
    setSankeyFilter();
    drawSankey(sankey_json, "#sankey")

}

function setSankeyExport() {
    jQuery("#export_params").html("")
}

function setSankeyFilter() {
    jQuery("#settings_div").html(
        "<input type='radio' name='type_homology' class='sankey-label first' id='one2one-button'>1-1</input> " +
        "<input type='radio' name='type_homology' class='sankey-label' id='one2many-button'>1-many</input> " +
        "<input type='radio' name='type_homology' class='sankey-label' id='paralogs-button'>Paralogs</input>" +
        "<input type='radio' name='type_homology' class='sankey-label last clicked' selected id='showall-button'>All</input>"
    )
}

