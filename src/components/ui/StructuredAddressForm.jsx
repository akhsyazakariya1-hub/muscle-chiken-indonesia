import React, { useState, useEffect } from 'react';
import { 
  INDONESIA_PROVINCES, 
  getCitiesByProvince, 
  getDistrictsByCity, 
  getVillagesByDistrict,
  formatStructuredAddress
} from '../../data/indonesiaRegions';
import { MapPin, AlertCircle } from 'lucide-react';

export const StructuredAddressForm = ({ value, onChange, errors = {} }) => {
  const [provinceId, setProvinceId] = useState(value?.provinceId || '33');
  const [provinceName, setProvinceName] = useState(value?.provinceName || 'Jawa Tengah');
  
  const [cityId, setCityId] = useState(value?.cityId || '3329');
  const [cityName, setCityName] = useState(value?.cityName || 'Kabupaten Brebes');

  const [districtId, setDistrictId] = useState(value?.districtId || '332904');
  const [districtName, setDistrictName] = useState(value?.districtName || 'Ketanggungan');

  const [villageId, setVillageId] = useState(value?.villageId || '3329042001');
  const [villageName, setVillageName] = useState(value?.villageName || 'Ketanggungan');

  const [street, setStreet] = useState(value?.street || '');
  const [houseNumber, setHouseNumber] = useState(value?.houseNumber || '');
  const [postalCode, setPostalCode] = useState(value?.postalCode || '52263');
  const [additionalDetails, setAdditionalDetails] = useState(value?.additionalDetails || '');

  const [latitude, setLatitude] = useState(value?.latitude || null);
  const [longitude, setLongitude] = useState(value?.longitude || null);
  const [isPinningMap, setIsPinningMap] = useState(false);

  // Available options based on cascading selections
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  // Load cities on province selection
  useEffect(() => {
    if (provinceId) {
      const availableCities = getCitiesByProvince(provinceId);
      setCities(availableCities);
      // Default to first city if current selection isn't in available list
      if (!availableCities.some(c => c.id === cityId)) {
        const first = availableCities[0] || { id: '', name: '' };
        setCityId(first.id);
        setCityName(first.name);
      }
    } else {
      setCities([]);
    }
  }, [provinceId]);

  // Load districts on city selection
  useEffect(() => {
    if (cityId) {
      const availableDistricts = getDistrictsByCity(cityId);
      setDistricts(availableDistricts);
      if (!availableDistricts.some(d => d.id === districtId)) {
        const first = availableDistricts[0] || { id: '', name: '' };
        setDistrictId(first.id);
        setDistrictName(first.name);
      }
    } else {
      setDistricts([]);
    }
  }, [cityId]);

  // Load villages on district selection
  useEffect(() => {
    if (districtId) {
      const availableVillages = getVillagesByDistrict(districtId);
      setVillages(availableVillages);
      if (!availableVillages.some(v => v.id === villageId)) {
        const first = availableVillages[0] || { id: '', name: '', postalCode: '52263' };
        setVillageId(first.id);
        setVillageName(first.name);
        if (first.postalCode) setPostalCode(first.postalCode);
      }
    } else {
      setVillages([]);
    }
  }, [districtId]);

  // Sync out whenever selection or inputs change
  useEffect(() => {
    const addressObj = {
      provinceId,
      provinceName,
      cityId,
      cityName,
      districtId,
      districtName,
      villageId,
      villageName,
      street,
      houseNumber,
      postalCode,
      additionalDetails,
      latitude,
      longitude,
      formattedAddress: formatStructuredAddress({
        street,
        houseNumber,
        villageName,
        districtName,
        cityName,
        provinceName,
        postalCode,
        additionalDetails
      })
    };

    if (onChange) onChange(addressObj);
  }, [
    provinceId, provinceName, 
    cityId, cityName, 
    districtId, districtName, 
    villageId, villageName, 
    street, houseNumber, 
    postalCode, additionalDetails, 
    latitude, longitude
  ]);

  const handleProvinceChange = (e) => {
    const pId = e.target.value;
    const pObj = INDONESIA_PROVINCES.find(p => p.id === pId);
    setProvinceId(pId);
    setProvinceName(pObj ? pObj.name : '');
  };

  const handleCityChange = (e) => {
    const cId = e.target.value;
    const cObj = cities.find(c => c.id === cId);
    setCityId(cId);
    setCityName(cObj ? cObj.name : '');
  };

  const handleDistrictChange = (e) => {
    const dId = e.target.value;
    const dObj = districts.find(d => d.id === dId);
    setDistrictId(dId);
    setDistrictName(dObj ? dObj.name : '');
  };

  const handleVillageChange = (e) => {
    const vId = e.target.value;
    const vObj = villages.find(v => v.id === vId);
    setVillageId(vId);
    setVillageName(vObj ? vObj.name : '');
    if (vObj && vObj.postalCode) {
      setPostalCode(vObj.postalCode);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsPinningMap(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(6)));
          setLongitude(Number(pos.coords.longitude.toFixed(6)));
          setIsPinningMap(false);
        },
        (err) => {
          setIsPinningMap(false);
          // Default fallbacks for Brebes / Jakarta SCBD if geo is blocked
          setLatitude(-6.9382);
          setLongitude(108.8872);
        }
      );
    }
  };

  return (
    <div className="space-y-3 font-sans text-xs">
      
      {/* A. PROVINCE DROPDOWN */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
          A. PROVINCE <span className="text-red-500">*</span>
        </label>
        <select
          value={provinceId}
          onChange={handleProvinceChange}
          className={`w-full p-2.5 rounded-xl bg-white border text-xs font-semibold focus:outline-none ${
            errors.province ? 'border-red-500 bg-red-50' : 'border-[#063B32]/20 focus:border-[#063B32]'
          }`}
        >
          <option value="">-- Select Province --</option>
          {INDONESIA_PROVINCES.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.province && (
          <p className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.province}
          </p>
        )}
      </div>

      {/* B. CITY / REGENCY DROPDOWN */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
          B. CITY / REGENCY <span className="text-red-500">*</span>
        </label>
        <select
          value={cityId}
          onChange={handleCityChange}
          disabled={!provinceId}
          className={`w-full p-2.5 rounded-xl bg-white border text-xs font-semibold focus:outline-none disabled:opacity-50 ${
            errors.city ? 'border-red-500 bg-red-50' : 'border-[#063B32]/20 focus:border-[#063B32]'
          }`}
        >
          <option value="">-- Select City / Regency --</option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.city && (
          <p className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.city}
          </p>
        )}
      </div>

      {/* C. DISTRICT & D. VILLAGE IN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* C. DISTRICT */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
            C. DISTRICT <span className="text-red-500">*</span>
          </label>
          <select
            value={districtId}
            onChange={handleDistrictChange}
            disabled={!cityId}
            className={`w-full p-2.5 rounded-xl bg-white border text-xs font-semibold focus:outline-none disabled:opacity-50 ${
              errors.district ? 'border-red-500 bg-red-50' : 'border-[#063B32]/20 focus:border-[#063B32]'
            }`}
          >
            <option value="">-- Select District --</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.district && (
            <p className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.district}
            </p>
          )}
        </div>

        {/* D. VILLAGE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
            D. VILLAGE / SUB-DISTRICT <span className="text-red-500">*</span>
          </label>
          <select
            value={villageId}
            onChange={handleVillageChange}
            disabled={!districtId}
            className={`w-full p-2.5 rounded-xl bg-white border text-xs font-semibold focus:outline-none disabled:opacity-50 ${
              errors.village ? 'border-red-500 bg-red-50' : 'border-[#063B32]/20 focus:border-[#063B32]'
            }`}
          >
            <option value="">-- Select Village --</option>
            {villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {errors.village && (
            <p className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.village}
            </p>
          )}
        </div>
      </div>

      {/* E. STREET & F. HOUSE NUMBER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
            E. STREET / ROAD <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g. Jl. Raya Ketanggungan"
            className={`w-full p-2.5 rounded-xl bg-white border text-xs focus:outline-none ${
              errors.street ? 'border-red-500 bg-red-50' : 'border-[#063B32]/20 focus:border-[#063B32]'
            }`}
          />
          {errors.street && (
            <p className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.street}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
            F. HOUSE NO. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder="e.g. 25 or Apt 14B"
            className={`w-full p-2.5 rounded-xl bg-white border text-xs focus:outline-none ${
              errors.houseNumber ? 'border-red-500 bg-red-50' : 'border-[#063B32]/20 focus:border-[#063B32]'
            }`}
          />
          {errors.houseNumber && (
            <p className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.houseNumber}
            </p>
          )}
        </div>
      </div>

      {/* G. POSTAL CODE & H. ADDITIONAL DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
            G. POSTAL CODE
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="e.g. 52263"
            className="w-full p-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs font-mono font-bold focus:outline-none focus:border-[#063B32]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#063B32] mb-1">
            H. ADDITIONAL DETAILS (Landmark / Benchmarks)
          </label>
          <input
            type="text"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="e.g. Near white mosque / Green gate / 2nd Floor"
            className="w-full p-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs focus:outline-none focus:border-[#063B32]"
          />
        </div>
      </div>

      {/* OPTIONAL MAP PIN BUTTON */}
      <div className="pt-1 flex items-center justify-between bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
        <div className="flex items-center gap-2 text-emerald-950">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="font-bold text-[11px] block">PIN YOUR DELIVERY LOCATION (OPTIONAL MAP PIN)</span>
            <span className="text-[10px] text-emerald-800">
              {latitude && longitude 
                ? `Pinned: ${latitude}, ${longitude}` 
                : 'Determine precise GPS coordinates for courier express'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isPinningMap}
          className="px-3 py-1.5 rounded-lg bg-[#063B32] text-[#D8C7A1] text-[10px] font-bold uppercase tracking-wider hover:bg-[#071B2A] transition-all shrink-0"
        >
          {isPinningMap ? 'Locating...' : latitude ? 'Update Pin' : 'Set Map Pin'}
        </button>
      </div>

    </div>
  );
};
