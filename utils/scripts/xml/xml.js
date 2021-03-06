var xml = {};

(function () {

    /*
     The function converts an E4X Xml object to a JSON object
     This function has been adapted from the work of Oleg Podsechin available at
     https://gist.github.com/olegp/642667
     It uses a slightly modified version of his algorithm , therefore
     all credit should be attributed to Oleg Podsechin.
     IMPORTANT:
     1. It does not create a 1..1 mapping due to the differences
     between Xml and JSON.It is IMPORTANT that you verify the structure
     of the object generated before using it.
     2. The input xml object must not contain the xml header information
     This is a known bug 336551 (Mozilla Developer Network)
     Source: https://developer.mozilla.org/en/docs/E4X
     Please remove the header prior to sending the xml object for processing.
     @root: A starting element in an E4X Xml object
     @return: A JSON object mirroring the provided Xml object
     */
    var recursiveConvertE4XtoJSON = function (root) {

        log.debug('Root: ' + root.localName());

        //Obtain child nodes
        var children = root.*;

        //The number of children
        var numChildren = children.length();

        //No children
        if (numChildren == 0) {

            //Extract contents
            return createJSONObject(root);
        }
        else {

            //Create an empty object
            var rootObject = createJSONObject(root);

            //Could be multiple children
            for (var childElementKey in children) {

                var child = children[childElementKey];

                log.debug('Examining child: ' + child.localName());

                //If the child just contains a single value then stop
                if (child.localName() == undefined) {

                    log.debug('Child is undefined: ' + child.toString());

                    //Change the object to just a key value pair
                    rootObject[root.localName()] = child.toString();
                    return rootObject;
                }

                //Make a recursive call to construct the child element
                var createdObject = recursiveConvertE4XtoJSON(child);

                log.debug('Converted object: ' + stringify(createdObject));

                //Check if the root object has the property
                if (rootObject.hasOwnProperty(child.localName())) {

                    log.debug('key: ' + child.localName() + ' already present.');
                    rootObject[child.localName()].push(createdObject);
                }
                else {

                    log.debug('key: ' + child.localName() + ' not present.');
                    rootObject[child.localName()] = [];
                    rootObject[child.localName()].push(createdObject);

                }
            }

            log.debug('root: ' + root.localName());

            return rootObject;
        }
    };

    /**
     * The function is used to convert an E4X xml to JSON
     * @param root
     */
    xml.convertE4XtoJSON = function (root) {
        return recursiveConvertE4XtoJSON(root);
    };


}());