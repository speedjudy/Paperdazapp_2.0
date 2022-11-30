import Vue from 'vue'
import login from './login'

export default {
  data() {
    return {
      fetchDataSign : {} as any,
      fetchDataInitial: {} as any
    }
  },
  mounted(){
    //@ts-ignore
    this.getUserSignatureToBlob()
  },

  mixins:[login],
  methods:{
    async getUserSignatureToBlob() {
      //@ts-ignore
      this.fetchDataSign = await fetch((this.$auth as any)?.user?.signatureURL).
      then((res)=>{return res.blob()}
      )
       //@ts-ignore
       this.fetchDataInitial = await fetch((this.$auth as any)?.user?.initialURL).
       then((res)=>{return res.blob()}
       )
    },
    dataURIToBlob(dataURI: string) {
      const splitDataURI = dataURI.split(',')
      if(splitDataURI.length < 1) return
      const byteString =
        splitDataURI[0].indexOf('base64') >= 0
          ? atob(splitDataURI[1])
          : decodeURI(splitDataURI[1])
      const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

      const ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

      return new Blob([ia], { type: mimeString })
    },
    async imageExported(image: any, isSignature: boolean) {
      //@ts-ignore
      if(this.dataURIToBlob(image).size == this.fetchDataSign.size) return
      //@ts-ignore
      else if(this.dataURIToBlob(image).size == this.fetchDataInitial.size) return
      // console.log(this.dataURIToBlob(image).size, this.fetchDataSign.size)
      const formData = new FormData()
      //@ts-ignore
      formData.append('upload', this.dataURIToBlob(image))
      formData.append('type', isSignature ? 'signature' : 'initial')
      // formData.append('type', 'image')
      //@ts-ignore
      formData.append('userId', (this.$auth|| {})?.user?.id)
      
         //@ts-ignore
        //  console.log(this.dataURIToBlob(image))
        //  return
      //@ts-ignore
      this.$axios.$post('/files', formData)
        .then(async () => {
          //@ts-ignore
          await this.filterUsers()
          //@ts-ignore
          this.$notify.success({
            title: isSignature ? 'Signature' : 'Initials',
            message: `Your ${
              isSignature ? 'signature' : 'initials'
            } has been uploaded`,
          })

        })
        //@ts-ignore
        .catch((err) => {
          //@ts-ignore
          this.$notify.error({
            title: isSignature ? 'Signature' : 'Initials',
            message:
              err.message ||
              `Error uploading ${isSignature ? 'signature' : 'initials'}`,
          })
        })
    },
  },
}