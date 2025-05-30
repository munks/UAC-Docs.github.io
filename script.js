let xhttp = new XMLHttpRequest();
let storage; //json 객체
let list; //List id 객체
let view; //View id 객체
let lang; //언어 설정
let pslider; //플레이어 수 객체
let pval;

window.onload = function () {
	if (navigator.language != null) {
		lang = navigator.language;
	} else if (navigator.userLanguage != null) {
		lang = navigator.userLanguage;
	} else if (navigator.systemLanguage != null) {
		lang = navigator.systemLanguage;
	}
	lang = lang.toLowerCase().substring(0,2);
	if (lang == 'ko') {
		lang = 'koKR';
	} else {
		lang = 'enUS';
	}
	
	list = document.getElementById('List');
	view = document.getElementById('ViewFrame');
	xhttp.open('GET', 'data.json', true);
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			storage = JSON.parse(this.response);
			
			for (i in storage.data) {
				let title = document.createElement('details');
				let item = document.createElement('summary');
				
				title.className = 'ListTitle';
				if (storage[lang][i] != null) {
					item.append(storage[lang][i].toString());
				} else {
					item.append(i);
				}
				
				title.appendChild(item);
				
				for (j in storage.data[i]) {
					let name = document.createElement('div');
					name.className = 'Selector';
					name.id = i.toString() + '/' + j.toString();
					if (storage[lang][j] != null) {
						name.append(storage[lang][j].toString());
					} else {
						name.append(j);
					}
					name.addEventListener('click', (e)=>{ getData(e.target.id); });
					
					title.appendChild(name);
				}
				list.append(title);
			}
		}
	};
	xhttp.send();
	
	pslider = document.getElementById("Player");
	pval = document.getElementById("PVal");
	pval.innerHTML = pslider.value;
	
	pslider.oninput = function() {
		pval.innerHTML = this.value;
	}
}

function getData (data) {
	let c = data.split('/');
	let text = '';
	let idx;
	let obj = storage.data[c[0]][c[1]];
	let t1 = (c[0] == 'UndeadT1') ? 'T1' : '';
	
	text += storage[lang][c[1]] + '<br><br>';
	
	for (i in obj) {
		switch (i) {
			//On Item
			case 'Ranged':
			case 'Spell':
			case 'AttackSpeed':
				text += storage[lang][i] + ': ' + obj[i].toString() + '%<br>';
				break;
			case 'RangeBonus':
			case 'EnergyRegen':
				text += storage[lang][i] + ': ' + obj[i].toString() + '<br>';
				break;
			case 'Special':
				text += '<br>' + storage[lang][c[1] + 'Special'] + '<br>';
				break;
			case 'Type':
			case 'Kind':
				idx = 0;
				text += '<br>' + storage[lang][i] + ': ';
				if (Array.isArray(obj[i])) {
					for (t in obj[i]) {
						if (idx != 0) {
							text += ', ';
						}
						text += storage[lang][obj[i][t]];
						idx++;
					}
				} else {
					text += storage[lang][obj[i]];
				}
				text += '<br>';
				break;
			//On Unit
			case 'Life':
			case 'Speed':
			case 'Armor':
				text += storage[lang][i];
				text += ': <span class="' + i + t1 + '" data-' + i.toLowerCase() + '="' + obj[i].toString() + '">'
				text += obj[i].toString();
				text += '</span><br>';
				break;
			case 'Behavior':
				text += '<br>';
				if (Array.isArray(obj[i])) {
					for (t in obj[i]) {
						text += storage[lang][obj[i][t]] + ': ' + storage[lang][obj[i][t] + 'Tip'] + '<br>';
						idx++;
					}
				} else {
					text += storage[lang][obj[i]] + ': ' + storage[lang][obj[i] + 'Tip'] + '<br>';
				}
				break;
			case 'Weapon':
				text += '<br>' + storage[lang][i] + '<br>';
				for (j in obj[i]) {
					switch (j) {
						case 'Range':
							text += storage[lang][j] + ': ' + ((obj[i][j] == 0) ? storage[lang].Melee : obj[i][j].toString()) + '<br>';
							break;
						case 'Period':
							text += storage[lang][j] + ': ' + obj[i][j].toString() + '<br>';
							break;
						case 'Damage':
							text += storage[lang][j];
							text += ': <span class="' + j + t1 + '" data-damage="' + obj[i][j][0].toString() + '" data-random="' + obj[i][j][1].toString() + '">';
							text += obj[i][j][0].toString() + '-' + (obj[i][j][0] + obj[i][j][1]).toString();
							text += '</span><br>';
							break;
						case 'DamageType':
							text += storage[lang][j] + ': ' + storage[lang][obj[i][j].toString()] + '<br>';
							break;
					}
				}
				break;
		}
	}
	view.innerHTML = text;
}