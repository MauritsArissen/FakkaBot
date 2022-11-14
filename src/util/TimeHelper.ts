class TimeHelper {

  public static millisecondToTimeFormat = (ms:number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms  / 1000 / 3600 ) % 24)
    return `${TimeHelper.numberToFixed(hours)}h ${TimeHelper.numberToFixed(minutes)}m ${TimeHelper.numberToFixed(seconds)}s`
  }

  private static numberToFixed = (n:number) => {
    return n < 10 ? `0${n}` : n;
  }

}

export default TimeHelper;