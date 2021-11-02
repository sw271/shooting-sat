import { ISatellitePass } from "./ISatellitePass";

export class SatellitePass {
  private _satellitePass: ISatellitePass;
  private _riseDatetime: Date;
  private _setDatetime: Date;

  constructor(args: ISatellitePass) {
    this._satellitePass = args;
    this._riseDatetime = new Date(args.riseDatetime);
    this._setDatetime = new Date(args.setDatetime);
  }

  get riseDatetime() {
    return this._riseDatetime;
  }
  get setDatetime() {
    return this._setDatetime;
  }
  get name() {
    return this._satellitePass.name;
  }
  get isVisble() {
    return this._satellitePass.isVisible;
  }
  get riseAzimuth() {
    return this._satellitePass.riseAzimuth;
  }
  get setAzimuth() {
    return this._satellitePass.setAzimuth;
  }
}
