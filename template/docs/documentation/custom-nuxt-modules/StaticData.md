# Static data ✅

## The idea 😏

**[Alban 🤔]**:  
– What do we do with Nuxt ? 🤔

**[Alban 😎]**:  
– We're generating websites 😏

**[Alban 🤔]**:  
 – So, in short, we're exporting API calls 😂

**[Alban 😎]**:  
 – Oww... yeah 😓

**[Alban 🦄]**:  
 – Not anymore guys! We'll make a module... **THE MODULE** 💪 It will be able to make all of our API calls... then it will write down the results in payload files 😍

**[Alban 😎][alban 🤔]**:

![alt text](../images/mouahah.gif 'Wow!')

## Practical reality 🤔

### Step by step tutorial 😎

Okay... easy:

1. Go to `~/config/static-data.js`.
1. Enter the routes you wanna blacklist in the _blacklist_ array.
1. It's done ✅. Every other routes will be **PAYLOADED** 🤘

## The things you don't really need to know but that you'll want to... because you're that curious 😂

This nuxt module is referenced in the _nuxt.config.js_ configuration file as a build module (see the [build modules documentation](https://nuxtjs.org/api/configuration-modules#-code-buildmodules-code-)).

The _blacklist_ array is passed as a module option, then the module takes care of everything.
