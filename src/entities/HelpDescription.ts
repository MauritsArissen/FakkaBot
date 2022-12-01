class HelpDescription {
  private name: string;
  private description: string;
  private usage: string;
  private example: string;

  constructor(
    name: string,
    description: string,
    usage: string,
    example: string
  ) {
    this.name = name;
    this.description = description;
    this.usage = usage;
    this.example = example;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getUsage(): string {
    return this.usage;
  }

  public getExample(): string {
    return this.example;
  }
}

export default HelpDescription;
