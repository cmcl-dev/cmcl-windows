#include <windows.h>
#include <tchar.h>
#include <stdio.h>
typedef void (WINAPI *LPFN_PGNSI)(LPSYSTEM_INFO);
BOOL Is64Bit_OS()
{
	BOOL bRetVal = FALSE;
	SYSTEM_INFO si = { 0 };
	LPFN_PGNSI pGNSI = (LPFN_PGNSI) GetProcAddress(GetModuleHandle(_T("kernel32.dll")), "GetNativeSystemInfo");
	if (pGNSI == NULL)
	{
		return FALSE;
	}
	pGNSI(&si);
	if (si.wProcessorArchitecture == PROCESSOR_ARCHITECTURE_AMD64 || 
	si.wProcessorArchitecture == PROCESSOR_ARCHITECTURE_IA64 )
	{
		bRetVal = TRUE;
	}
	else
	{
	}
	return bRetVal;
}
int main(void)
{
if(Is64Bit_OS())printf("{\"bit\":\"x64\"}");
else printf("{\"bit\":\"x86\"}");
return 0;
}
