import avatar1 from "@/assets/images/avatar1.jpeg";
import avatar2 from "@/assets/images/avatar2.jpeg";
import avatar3 from "@/assets/images/avatar3.jpeg";
import avatar4 from "@/assets/images/avatar4.jpeg";
import avatar5 from "@/assets/images/avatar5.jpeg";
import avatar6 from "@/assets/images/avatar6.jpeg";
import avatar7 from "@/assets/images/avatar7.jpeg";

const avatarList = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
];

const text =
  "Quis ex aute eiusmod enim duis consequat Lorem culpa officia ex ut in minim et nisi fugiat est excepteur id cupidatat in est tempor incididunt voluptate voluptate sint velit voluptate deserunt commodo ipsum ex Lorem cupidatat tempor anim in culpa ea aute magna amet anim et laborum amet amet ad laborum velit nisi nostrud voluptate occaecat commodo enim qui voluptate nostrud ea aliqua cupidatat aute incididunt est minim nulla aliqua ipsum velit quis quis voluptate pariatur id culpa tempor magna.Fugiat magna esse dolor pariatur ut ipsum irure eiusmod fugiat elit elit sit et adipisicing pariatur commodo elit est ipsum mollit irure sunt velit pariatur Lorem in occaecat ea id voluptate enim quis proident reprehenderit esse do ut occaecat do consectetur minim labore exercitation sunt fugiat mollit laborum do aliquip aliquip non ea qui ea ut excepteur tempor ex duis qui occaecat in nisi enim ex reprehenderit aliqua qui ex sint fugiat ut proident deserunt aute consequat nisi et reprehenderit consequat voluptate voluptate magna velit ut est nisi amet eiusmod non.In et reprehenderit tempor non cupidatat cupidatat eiusmod ex ea ad laborum adipisicing proident aute irure cupidatat sit nostrud est elit proident dolor ut incididunt labore ea sit exercitation duis commodo sit mollit quis esse reprehenderit adipisicing eiusmod laboris dolore magna reprehenderit culpa sint nostrud magna minim sint culpa in sit officia id labore tempor duis aliquip minim deserunt excepteur nostrud quis excepteur amet consequat cillum eiusmod occaecat magna excepteur non Lorem reprehenderit aliquip labore aliqua voluptate qui irure nisi culpa laborum aliqua consectetur dolor dolor excepteur mollit quis laborum cupidatat ad sit fugiat Lorem sint commodo ipsum.Reprehenderit excepteur dolor duis ea laboris commodo sunt magna do eu reprehenderit laboris commodo deserunt est nulla proident officia eu nostrud Lorem ea nostrud ea proident ad cillum eu velit sit voluptate voluptate eu non aliqua nostrud ex occaecat eu enim elit consectetur aliquip est magna exercitation Lorem cupidatat laboris reprehenderit id et enim mollit non mollit anim duis veniam eiusmod proident aliquip quis commodo laboris mollit est ex do nostrud aute magna consectetur ullamco duis ea aliquip duis nisi proident.Fugiat eiusmod officia duis laborum ut ipsum occaecat aliqua elit et aliquip ea ipsum minim anim magna amet tempor est nostrud pariatur ea aliqua ullamco ut dolor qui esse nisi exercitation officia ex in ullamco id exercitation ullamco dolore do sint veniam veniam commodo duis sint consectetur quis adipisicing reprehenderit esse aliquip excepteur labore est tempor enim eu ea labore consectetur consectetur esse exercitation cupidatat excepteur proident sunt eu consectetur do quis proident sunt proident velit nostrud elit cillum consequat sunt cupidatat esse adipisicing irure aliqua veniam Lorem incididunt nulla Lorem exercitation.Anim anim veniam officia eiusmod nostrud laborum aliqua reprehenderit eu velit enim nulla ullamco minim excepteur reprehenderit in amet irure mollit reprehenderit qui exercitation proident commodo deserunt aliqua proident veniam officia amet sit excepteur nostrud commodo consectetur qui sit qui adipisicing consequat voluptate et anim culpa excepteur tempor adipisicing nostrud sint cillum exercitation mollit dolore aliquip consequat nisi amet est occaecat exercitation et do tempor ullamco sit cupidatat quis culpa anim velit ut sunt aliquip ipsum nisi est culpa amet consectetur sint proident velit laborum consectetur exercitation quis excepteur irure non dolor.";

export interface IItemData {
  index: number,
  content: string,
  image: string,
}

export const getList = () => {
  const data: IItemData[] = []
  for (let i = 0; i < 10000; i++) {
    const imageRandom = Math.floor(Math.random() * 7);
    const textRandomStart = Math.floor(Math.random() * 200);
    const textRandomLength = Math.floor(Math.random() * 200);

    data.push({
      index: i,
      image: avatarList[imageRandom],
      content: text.slice(textRandomStart, textRandomStart + textRandomLength)
    });
  }
  return data
}

