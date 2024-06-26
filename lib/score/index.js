import { Vex } from "vexflow";

const { Factory } = Vex.Flow;

const WIDTH = 1250;
const HEIGHT = 1750;

const calBarNote = (dummyData, time) => {
  const barList = [];
  const timeData = time.split("/");
  time = Number(timeData[0]) / Number(timeData[1]);

  let bar = [];
  let calTime = 0;
  for (const index in dummyData) {
    const el = dummyData[index];

    const beat = el.split("/")[1];
    calTime += 1 / Number(beat);
    bar.push(el);

    if (calTime == Number(time)) {
      barList.push(bar);
      bar = [];
      calTime = 0;
    } else if (calTime > Number(time)) {
      bar.pop();
      bar.push(`b4/${1 / (time - (calTime - 1 / Number(beat)))}/r`);
      barList.push(bar);
      bar = [];
      calTime = 0;

      calTime += 1 / Number(beat);
      bar.push(el);
    }
  }

  if (calTime != 0) {
    const lastEle = bar[bar.length - 1].split("/");
    const beat = lastEle[1];
    if (lastEle[2]) {
      bar.pop();
      bar.push(`b4/${1 / (time - (calTime - 1 / Number(beat)))}/r`);
    } else {
      bar.push(`b4/${1 / (time - calTime)}/r`);
    }

    barList.push(bar);
  }

  return barList.map((barEl) => {
    return barEl.join(", ");
  });
};

const setScore = (f, time, List) => {
  const score = f.EasyScore();
  const spliteLineList = ArraySplit(List);

  const options = {
    minHeight: 20,
    heightInterval: 110,
    width: 300,
  };

  spliteLineList.forEach((line, lineIndex) => {
    const voiceArray = [];
    let firstStave;

    line.forEach((bar, barIndex) => {
      const stave = f.Stave({
        y: options.minHeight + lineIndex * options.heightInterval,
        x: options.width * barIndex,
        width: options.width,
      });

      if (barIndex == 0) {
        firstStave = stave;
        stave.addTrebleGlyph().addTimeSignature(time);
      }

      const notes = score.notes(bar);
      const voice = score.voice(notes, { time });
      voiceArray.push(voice);
    });

    f.Formatter()
      .joinVoices([voiceArray[0]])
      .formatToStave([voiceArray[0]], firstStave);

    if (voiceArray.length > 1) {
      f.Formatter()
        .joinVoices(voiceArray.filter((e, idx) => idx != 0))
        .formatToStave(
          voiceArray.filter((e, idx) => idx != 0),
          f.getStave()
        );
    }
  });
  f.draw();
};

const run = (targetEle, data, time) => {
  const options = {
    width: WIDTH,
    height: HEIGHT,
    justify: true,
    alpha: 0.1,
  };

  const f = new Factory({
    renderer: {
      elementId: targetEle.current.id,
      width: options.width,
      height: options.height,
    },
  });

  setScore(f, time, calBarNote(data, time));

  return targetEle.current.toDataURL("image/jpg", 1.0);
};

const ArraySplit = (data = [], size = 4) => {
  const arr = [];

  for (let i = 0; i < data.length; i += size) {
    arr.push(data.slice(i, i + size));
  }

  return arr;
};

const ScoreMaker = {
  run,
};

export default ScoreMaker;
