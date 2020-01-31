function format(input){
    var phoneComponents = /[0-9]/g;
    var x = input.match(phoneComponents);
    if(x == null){
        return '';
    }else{
        //console.log(x)
        var res = '';
        if(x.length > 0 ){
            if(x[0] == 1){
                // If The First Number is A 1, No Area Codes Begin With 1, So This Is A Country Code
                res += '+1 ';
                // Remove The First Number
                x.splice(0,1);
            }

            // Get Base Phone Number Format
            if(x.length >= 10){
                // Phone Number Can Be Formatted As A Phone Number
                res += '(' + x[0] + x[1] + x[2] + ') ' + x[3] + x[4] + x[5] + '-' + x[6] + x[7] + x[8] + x[9];
                // Remove These Items
                x.splice(0,10);
            }else if(x.length < 10 && x.length > 0){
                // Partial Phone Number, Get As Far As You Can
                switch (x.length) {
                    case 1:
                        res += '(' + x[0];
                        break;
                    case 2:
                        res += '(' + x[0] + x[1];
                        break;
                    case 3:
                        res += '(' + x[0] + x[1] + x[2] + ') ';
                        break;
                    case 4:
                        res += '(' + x[0] + x[1] + x[2] + ') ' + x[3];
                        break;
                    case 5:
                        res += '(' + x[0] + x[1] + x[2] + ') ' + x[3] + x[4];
                        break;
                    case 6:
                        res += '(' + x[0] + x[1] + x[2] + ') ' + x[3] + x[4] + x[5];
                        break;
                    case 7:
                        res += '(' + x[0] + x[1] + x[2] + ') ' + x[3] + x[4] + x[5] + '-' + x[6];
                        break;
                    case 8:
                        res += '(' + x[0] + x[1] + x[2] + ') ' + x[3] + x[4] + x[5] + '-' + x[6] + x[7];
                        break;
                    case 9:
                        res += '(' + x[0] + x[1] + x[2] + ') ' + x[3] + x[4] + x[5] + '-' + x[6] + x[7] + x[8];
                        break;
                    default:
                        //console.log("This Should Not Occur")
                        break;
                }
                // Remove Processed Digits
                x.splice(0,x.length);
            }

            // Process The Remaining Digits As An Extention Number
            if(x.length > 0 && x.length < 255){
                // Arbitary Limit On Phone Number Length of 255 Characters
                res += ' ext ' + x.join('');
            }
        }else{
            // The Input Is Empty As Far As We Care
        }
        //console.log('Formatted Input: ' + res);
        return res;
    }
}

function clean(input){
    var phoneComponents = /[0-9]/g;
    var x = input.match(phoneComponents);
    //console.log('Cleaned Input: ' + x.join(''));
    return x.join('');
}

export default {
    format,
    clean
}