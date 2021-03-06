/* vim: set expandtab ts=4 sw=4: */
/*
 * You may redistribute this program and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Fs = require('fs');

var makeNodes = function (keys) {
    var out = {};
    for (var i = 0; i < keys.length; i++) {
        out['node'+i] = {
            privateKey: keys[i],
            peers: []
        };
    }

    var links = 0;
    var linkedNodes = [1];
    while (linkedNodes.length < keys.length) {
        var linked = ((Math.random() * 1e9) | 0) % Object.keys(linkedNodes).length;
        var unlinked = ((Math.random() * 1e9) | 0) % keys.length;
        links++;
        if (linkedNodes.indexOf(unlinked) === -1) { linkedNodes.push(unlinked); }
        if (Math.random() > 0.5) {
            var x = linked;
            linked = unlinked;
            unlinked = x;

        }
        out['node'+unlinked].peers.push('node'+linked);
    }
    console.log(JSON.stringify({nodes: out}, null, '  '));
};

if (process.argv[process.argv.length-1].split('/').pop() === __filename.split('/').pop()) {
    console.log("usage: " + process.argv[process.argv.length-1] + ' keys.txt');
    console.log("See makekeys.c to see how to generate keys.txt");
    return;
}

Fs.readFile(process.argv[process.argv.length-1], function (err, ret) {
    if (err) { throw err; }
    var keys = ret.toString('utf8').split('\n');
    for (var i = keys.length-1; i >= 0; i--) {
        if (!(/^[a-f0-9]{64}$/.test(keys[i]))) {
            keys.splice(i, 1);
        }
    }
    makeNodes(keys);
});
