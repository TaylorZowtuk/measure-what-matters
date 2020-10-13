// Credit: RobC on stackoverflow.com - (https://stackoverflow.com/a/50275198/10454730)
const args = process.argv;
const mssg = args[2];

const opts = ['-s', '--set', '-b', '--bg-color', '-f', '--font-color'];

function excapeAnsiCode(code) {
  return '\x1b[' + code + 'm';
}

const ansiStyles = opts.map(function(opt) {
  return args.indexOf(opt) > -1
    ? excapeAnsiCode(args[args.indexOf(opt) + 1])
    : '';
});

console.log('%s%s%s', ansiStyles.join(''), mssg, '\x1b[0m');
